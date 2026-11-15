import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import { Prisma } from '../../../prisma/client.js';
import { AccessRequestCatalogMissingException } from '../exceptions/access-request-catalog-missing.exception.js';
import { ActiveAccessRequestExistsException } from '../exceptions/active-access-request-exists.exception.js';
import type { CreateAccessRequestDto } from '../requests/create-access-request.schema.js';
import { ACCESS_REQUEST_STATUS } from '../types/access-request.enum.js';

@Injectable()
export class DirectRegistrationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async ensureEmailAvailable(email: string) {
    const existing = await this.prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
      select: { id: true },
    });
    if (existing) {
      throw new ActiveAccessRequestExistsException(
        'Este correo ya tiene una cuenta. Inicia sesión con ella.',
      );
    }
  }

  async create(input: CreateAccessRequestDto, passwordHash: string) {
    const { career, ...data } = input;
    const now = new Date();
    try {
      // La escritura anidada crea los datos de registro, usuario y rol de forma atómica.
      const request = await this.prisma.accessRequest.create({
        data: {
          ...data,
          requestCode: `QA-${randomUUID().replaceAll('-', '').slice(0, 16)}`,
          submittedAt: now,
          reviewedAt: now,
          status: { connect: { title: ACCESS_REQUEST_STATUS.APPROVED } },
          career: { connect: { title: career } },
          approvedUser: {
            create: {
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              phone: data.phone,
              password: passwordHash,
              isActive: true,
              roles: { create: { role: { connect: { name: 'titulado' } } } },
            },
          },
        },
        select: { approvedUser: { select: { id: true, email: true } } },
      });
      return request.approvedUser;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ActiveAccessRequestExistsException(
            'El correo, carnet o código SIS ya está registrado. Usa otros datos o inicia sesión.',
          );
        }
        if (error.code === 'P2025') {
          throw new AccessRequestCatalogMissingException();
        }
      }
      throw error;
    }
  }
}
