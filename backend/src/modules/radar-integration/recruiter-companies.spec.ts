import { ForbiddenException } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import type { PrismaService } from '../../common/prisma/prisma.service.js';
import { ProfileSkillsEvents } from '../../common/profile-skills/profile-skills-events.service.js';
import type { ProfileSkillsAnalysisService } from '../nlp/services/profile-skills-analysis.service.js';
import { RadarIntegrationService } from './radar-integration.service.js';

const userId = '11111111-1111-4111-8111-111111111111';
const companyId = '22222222-2222-4222-8222-222222222222';

function setup() {
  const prisma = {
    userRole: { findFirst: vi.fn().mockResolvedValue({ id: 'active-company-role' }) },
    $queryRaw: vi.fn(),
  };
  const service = new RadarIntegrationService(
    prisma as unknown as PrismaService,
    {} as ProfileSkillsAnalysisService,
    new ProfileSkillsEvents(),
  );
  return { prisma, service };
}

describe('Recruiter company bindings', () => {
  it.each([
    { rows: [{ id: companyId, name: 'Empresa vinculada' }] },
    { rows: [] },
  ])('returns the real mapped companies without synthesizing a fallback: $rows', async ({ rows }) => {
    const { prisma, service } = setup();
    prisma.$queryRaw.mockResolvedValue(rows);

    await expect(service.recruiterCompanies(userId)).resolves.toEqual(rows);
    expect(prisma.userRole.findFirst).toHaveBeenCalledWith({
      where: { userId, deletedAt: null, role: { name: 'empresa' } },
      select: { id: true },
    });
    const [strings, ...parameters] = prisma.$queryRaw.mock.calls[0];
    expect(parameters).toEqual([userId]);
    expect(strings.join('')).toContain('WHERE a.user_id=');
    expect(strings.join('')).not.toContain(userId);
  });

  it('denies a user without an active company role before querying tenant bindings', async () => {
    const { prisma, service } = setup();
    prisma.userRole.findFirst.mockResolvedValue(null);

    await expect(service.recruiterCompanies(userId)).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.$queryRaw).not.toHaveBeenCalled();
  });

  it('propagates a failed company lookup instead of returning a successful empty list', async () => {
    const { prisma, service } = setup();
    const failure = new Error('Company lookup unavailable');
    prisma.$queryRaw.mockRejectedValue(failure);

    await expect(service.recruiterCompanies(userId)).rejects.toBe(failure);
  });
});
