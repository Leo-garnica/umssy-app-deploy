import { ForbiddenException, UnauthorizedException, type ExecutionContext } from '@nestjs/common';
import { describe, expect, it, vi } from 'vitest';
import { RequestValidationException } from '../../../common/exceptions/request-validation.exception.js';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard.js';
import type { PrismaService } from '../../../common/prisma/prisma.service.js';
import { JobOffersController } from '../controllers/job-offers.controller.js';
import { CompanyJobOfferGuard } from '../guards/company-job-offer.guard.js';

const userId = '11111111-1111-4111-8111-111111111111';
const companyId = '22222222-2222-4222-8222-222222222222';
function setup(roles: string[] | null = ['empresa'], company: unknown = companyId) {
  const prisma = { $queryRaw: vi.fn().mockResolvedValue([{ authorized: 1 }]) };
  const context = { switchToHttp: () => ({ getRequest: () => ({ params: { companyId: company }, user: roles ? { id: userId, roles } : undefined }) }) } as unknown as ExecutionContext;
  return { guard: new CompanyJobOfferGuard(prisma as unknown as PrismaService), prisma, context };
}

describe('Company vacancy authorization', () => {
  it('protects creation and company listings with authentication before company authorization', () => {
    for (const name of ['create', 'listByCompany']) {
      const method = Reflect.get(JobOffersController.prototype, name) as object;
      expect(Reflect.getMetadata('__guards__', method)).toEqual([JwtAuthGuard, CompanyJobOfferGuard]);
    }
  });

  it('requires an authenticated identity before looking up company access', async () => {
    const { guard, context, prisma } = setup(null);
    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(UnauthorizedException);
    expect(prisma.$queryRaw).not.toHaveBeenCalled();
  });

  it.each([{ roles: [] }, { roles: ['titulado'] }, { roles: ['administrativo'] }])('rejects roles without company access: %j', async ({ roles }) => {
    const { guard, context, prisma } = setup(roles);
    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(ForbiddenException);
    expect(prisma.$queryRaw).not.toHaveBeenCalled();
  });

  it.each(['not-a-uuid', null, ['ambiguous']])('validates company identity before querying: %j', async company => {
    const { guard, context, prisma } = setup(['empresa'], company);
    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(RequestValidationException);
    expect(prisma.$queryRaw).not.toHaveBeenCalled();
  });

  it('rejects an unlinked company instead of accepting a companyId from the client', async () => {
    const { guard, context, prisma } = setup();
    prisma.$queryRaw.mockResolvedValue([]);
    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('allows only the company-to-session binding and parameterizes both identifiers', async () => {
    const { guard, context, prisma } = setup();
    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(prisma.$queryRaw.mock.calls[0].slice(1)).toEqual([companyId, userId]);
  });
});
