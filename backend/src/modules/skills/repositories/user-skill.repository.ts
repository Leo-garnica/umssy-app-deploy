import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import type { Prisma } from '../../../prisma/client.js';
import { USER_SKILL_SOURCES, USER_SKILL_VERIFICATION_STATUSES } from '../constants/user-skill.constants.js';
import type { UserSkillRecord } from '../types/user-skill-record.type.js';
import type { NlpEvidenceRef } from '../../nlp/types/nlp-evidence-ref.type.js';
import type { NlpSkillReconciliation } from '../../nlp/types/nlp-skill-reconciliation.type.js';
import type { ProfileSkillRow } from '../../nlp/types/profile-skill-row.type.js';
import { planManualSkillChanges } from '../utils/plan-manual-skill-changes.js';
import { skillSelect } from './skill.repository.js';

const userSkillSelect = { skill: { select: skillSelect } } as const;
const sourceRowSelect = { id: true, skillId: true, source: true, evidenceRefs: true } as const;

export const profileSkillRowSelect = {
  id: true,
  skillId: true,
  source: true,
  verificationStatus: true,
  isHighRelevance: true,
  evidenceRefs: true,
  skill: { select: { name: true, areaId: true } },
} as const;

const toJson = (refs: readonly NlpEvidenceRef[]) =>
  refs.map((ref) => ({ type: ref.type, id: ref.id }));

@Injectable()
export class UserSkillRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByUserId(userId: string): Promise<UserSkillRecord[]> {
    return this.prisma.userSkill.findMany({
      where: { userId, source: USER_SKILL_SOURCES.manual },
      orderBy: { skill: { name: 'asc' } },
      select: userSkillSelect,
    });
  }

  findProfileSkillRows(
    userId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<ProfileSkillRow[]> {
    const client = tx ?? this.prisma;
    return client.userSkill.findMany({
      where: { userId },
      orderBy: { skill: { name: 'asc' } },
      select: profileSkillRowSelect,
    });
  }

  async applyReconciliationPlan(
    userId: string,
    plan: NlpSkillReconciliation,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const client = tx ?? this.prisma;
    if (plan.deleteIds.length > 0) {
      await client.userSkill.deleteMany({
        where: { userId, id: { in: plan.deleteIds } },
      });
    }
    for (const update of plan.updates) {
      await client.userSkill.update({
        where: { id: update.id },
        data: {
          evidenceRefs: toJson(update.evidenceRefs),
          isHighRelevance: update.isHighRelevance,
        },
      });
    }
    if (plan.creates.length > 0) {
      await client.userSkill.createMany({
        data: plan.creates.map((create) => ({
          userId,
          skillId: create.skillId,
          source: USER_SKILL_SOURCES.nlp,
          verificationStatus: USER_SKILL_VERIFICATION_STATUSES.pending,
          isHighRelevance: true,
          evidenceRefs: toJson(create.evidenceRefs),
        })),
        skipDuplicates: true,
      });
    }
  }

  async replaceForUser(userId: string, skillIds: string[]): Promise<UserSkillRecord[]> {
    await this.prisma.$transaction(async (tx) => {
      const rows = await tx.userSkill.findMany({ where: { userId }, select: sourceRowSelect });
      const changes = planManualSkillChanges(rows, skillIds);

      if (changes.deleteIds.length > 0) {
        await tx.userSkill.deleteMany({ where: { userId, id: { in: changes.deleteIds } } });
      }
      if (changes.toDetectedIds.length > 0) {
        await tx.userSkill.updateMany({
          where: { userId, id: { in: changes.toDetectedIds } },
          data: { source: USER_SKILL_SOURCES.nlp },
        });
      }
      if (changes.toManualIds.length > 0) {
        await tx.userSkill.updateMany({
          where: { userId, id: { in: changes.toManualIds } },
          data: { source: USER_SKILL_SOURCES.manual },
        });
      }
      if (changes.createSkillIds.length > 0) {
        await tx.userSkill.createMany({
          data: changes.createSkillIds.map((skillId) => ({ userId, skillId, source: USER_SKILL_SOURCES.manual })),
          skipDuplicates: true,
        });
      }
    });

    return this.findByUserId(userId);
  }
}
