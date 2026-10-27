import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import { UserSkillRepository, profileSkillRowSelect } from '../../skills/repositories/user-skill.repository.js';
import { NLP_PROCESSING_STATUSES } from '../constants/nlp-processing.constants.js';
import type { NlpDetectedSkill } from '../types/nlp-detected-skill.type.js';
import type { NlpPublishResult } from '../types/nlp-publish-result.type.js';
import type { ProfileSkillProcessingState } from '../types/profile-skill-processing-state.type.js';
import type { ProfileSkillRow } from '../types/profile-skill-row.type.js';
import { planSkillReconciliation } from '../utils/plan-skill-reconciliation.js';
import { toErrorCode } from '../utils/to-error-code.js';

const UNIQUE_CONSTRAINT_VIOLATION = 'P2002';

export { profileSkillRowSelect };

export const processingStateSelect = {
  userId: true,
  status: true,
  inputRevision: true,
  processedRevision: true,
  resultVersion: true,
  updatedAt: true,
  dictionaryVersion: true,
} as const;

@Injectable()
export class ProfileSkillResultsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userSkillRepository: UserSkillRepository,
  ) {}

  findState(userId: string): Promise<ProfileSkillProcessingState | null> {
    return this.prisma.profileSkillProcessingState.findUnique({
      where: { userId },
      select: processingStateSelect,
    });
  }

  findProfileSkillRows(userId: string): Promise<ProfileSkillRow[]> {
    return this.userSkillRepository.findProfileSkillRows(userId);
  }

  async registerSourceChange(userId: string, now: Date): Promise<ProfileSkillProcessingState> {
    const upsert = () =>
      this.prisma.profileSkillProcessingState.upsert({
        where: { userId },
        create: { userId, status: NLP_PROCESSING_STATUSES.pending, inputRevision: 1, updatedAt: now },
        update: { status: NLP_PROCESSING_STATUSES.pending, inputRevision: { increment: 1 }, updatedAt: now },
        select: processingStateSelect,
      });
    try {
      return await upsert();
    } catch (error) {
      if (toErrorCode(error) !== UNIQUE_CONSTRAINT_VIOLATION) throw error;
      return upsert();
    }
  }

  ensureState(userId: string, now: Date): Promise<ProfileSkillProcessingState> {
    return this.prisma.profileSkillProcessingState.upsert({
      where: { userId },
      create: { userId, status: NLP_PROCESSING_STATUSES.pending, inputRevision: 0, updatedAt: now },
      update: {},
      select: processingStateSelect,
    });
  }

  async markError(userId: string, revision: number, now: Date): Promise<void> {
    await this.prisma.profileSkillProcessingState.updateMany({
      where: { userId, inputRevision: revision },
      data: { status: NLP_PROCESSING_STATUSES.error, updatedAt: now },
    });
  }

  publish(
    userId: string,
    revision: number,
    detected: readonly NlpDetectedSkill[],
    dictionaryVersion: string,
    now: Date,
  ): Promise<NlpPublishResult | null> {
    return this.prisma.$transaction(async (tx) => {
      const claimed = await tx.profileSkillProcessingState.updateMany({
        where: { userId, inputRevision: revision },
        data: { updatedAt: now },
      });
      if (claimed.count === 0) return null;

      const previous = await tx.profileSkillProcessingState.findUnique({
        where: { userId },
        select: { processedRevision: true },
      });
      const rows = await this.userSkillRepository.findProfileSkillRows(userId, tx);
      const plan = planSkillReconciliation(rows, detected);

      await this.userSkillRepository.applyReconciliationPlan(userId, plan, tx);

      const changed = plan.creates.length + plan.updates.length + plan.deleteIds.length > 0;
      const isFirstResult = previous?.processedRevision === null;
      const state = await tx.profileSkillProcessingState.update({
        where: { userId },
        data: {
          status: NLP_PROCESSING_STATUSES.ready,
          processedRevision: revision,
          dictionaryVersion,
          updatedAt: now,
          ...(changed || isFirstResult ? { resultVersion: { increment: 1 } } : {}),
        },
        select: processingStateSelect,
      });
      return { state, changed };
    });
  }
}
