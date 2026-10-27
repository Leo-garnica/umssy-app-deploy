import { ForbiddenException, Injectable, UnauthorizedException, type CanActivate, type ExecutionContext } from '@nestjs/common';
import { z } from 'zod';
import { RequestValidationException } from '../../../common/exceptions/request-validation.exception.js';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import type { AuthenticatedRequest } from '../../../common/types/authenticated-request.types.js';
import { JOB_OFFER_VALIDATION_MESSAGES } from '../constants/job-offer.constants.js';

@Injectable()
export class CompanyJobOfferGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;
    if (!user) throw new UnauthorizedException('Se requiere una sesión válida');
    if (!user.roles.includes('empresa')) throw new ForbiddenException('Se requiere rol empresa');
    const companyId = request.params.companyId;
    if (!z.uuid().safeParse(companyId).success) {
      throw new RequestValidationException([{ field: 'companyId', message: JOB_OFFER_VALIDATION_MESSAGES.INVALID_COMPANY_ID }]);
    }
    const rows = await this.prisma.$queryRaw<{ authorized: number }[]>`
      SELECT 1 AS authorized FROM radar_company_access
      WHERE company_id=${companyId}::uuid AND user_id=${user.id}::uuid`;
    if (!rows.length) throw new ForbiddenException('Empresa no vinculada a esta sesión');
    return true;
  }
}
