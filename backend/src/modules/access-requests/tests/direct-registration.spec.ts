import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { describe, expect, it, vi } from 'vitest';
import { Prisma } from '../../../prisma/client.js';
import type { PrismaService } from '../../../common/prisma/prisma.service.js';
import { directRegistrationSchema } from '../requests/direct-registration.schema.js';
import { DirectRegistrationRepository } from '../repositories/direct-registration.repository.js';
import { DirectRegistrationService } from '../services/direct-registration.service.js';
import { DirectRegistrationController } from '../controllers/direct-registration.controller.js';
import { ActiveAccessRequestExistsException } from '../exceptions/active-access-request-exists.exception.js';
import { AccessRequestCatalogMissingException } from '../exceptions/access-request-catalog-missing.exception.js';

const input = {
  firstName: 'Ana', lastName: 'Pérez', idCardNumber: '7654321',
  idCardIssuedIn: 'CB', sisCode: '201904512', email: 'ana@example.com',
  birthDate: '1999-01-01', graduationYear: 2024, career: 'Licenciatura en Ingeniería de Sistemas',
  password: 'Prueba2026',
};

function build(env: Record<string, string> = { UMSSY_DEPLOYMENT_ENV: 'qa', ENABLE_DIRECT_REGISTRATION: 'true' }) {
  const prisma = {
    user: { findFirst: vi.fn().mockResolvedValue(null) },
    accessRequest: { create: vi.fn().mockResolvedValue({ approvedUser: { id: 'new-user', email: input.email } }) },
  };
  const repository = new DirectRegistrationRepository(prisma as unknown as PrismaService);
  const service = new DirectRegistrationService(new ConfigService(env), repository);
  return { prisma, repository, service, controller: new DirectRegistrationController(service) };
}

describe('Direct registration for the QA deployment', () => {
  it('normalizes email, accepts existing personal fields and discards client-supplied privileges', () => {
    const result = directRegistrationSchema.parse({ ...input, email: ' ANA@EXAMPLE.COM ', roles: ['admin'], isActive: false });
    expect(result.email).toBe(input.email);
    expect(result).not.toHaveProperty('roles');
    expect(result.birthDate).toBeInstanceOf(Date);
  });

  it.each(['short', 'abcdefgh9', 'Abcdefghi', 'A1' + 'é'.repeat(40)])('rejects invalid password %s', password => {
    expect(directRegistrationSchema.safeParse({ ...input, password }).success).toBe(false);
  });

  it('retains the age and graduation-year validations', () => {
    expect(directRegistrationSchema.safeParse({ ...input, birthDate: '2020-01-01' }).success).toBe(false);
    expect(directRegistrationSchema.safeParse({ ...input, graduationYear: 2005 }).success).toBe(false);
  });

  it.each([
    {}, { UMSSY_DEPLOYMENT_ENV: 'production', ENABLE_DIRECT_REGISTRATION: 'true' },
    { UMSSY_DEPLOYMENT_ENV: 'qa' }, { UMSSY_DEPLOYMENT_ENV: 'qa', ENABLE_DIRECT_REGISTRATION: 'false' },
  ])('does not create accounts outside the explicitly enabled QA mode: %j', async env => {
    const { service, prisma } = build(env);
    await expect(service.register(directRegistrationSchema.parse(input))).rejects.toBeInstanceOf(NotFoundException);
    expect(prisma.user.findFirst).not.toHaveBeenCalled();
    expect(prisma.accessRequest.create).not.toHaveBeenCalled();
  });

  it('creates an active graduate, stores the complete registration and hashes the password without requiring an OTP', async () => {
    const { controller, prisma } = build();
    await expect(controller.register(directRegistrationSchema.parse(input))).resolves.toEqual({ id: 'new-user', email: input.email });
    const { data } = prisma.accessRequest.create.mock.calls[0][0];
    const user = data.approvedUser.create;
    expect(await bcrypt.compare(input.password, user.password)).toBe(true);
    expect(user.password).not.toBe(input.password);
    expect(user.roles.create.role.connect.name).toBe('titulado');
    expect(user.isActive).toBe(true);
    expect(data.idCardNumber).toBe(input.idCardNumber);
    expect(data.sisCode).toBe(input.sisCode);
    expect(data.requestCode).toMatch(/^QA-[a-f0-9]{16}$/);
    expect(data).not.toHaveProperty('password');
    expect(data).not.toHaveProperty('documentFileId');
  });

  it('rejects an existing account before attempting to overwrite any data', async () => {
    const { service, prisma } = build();
    prisma.user.findFirst.mockResolvedValue({ id: 'existing' });
    await expect(service.register(directRegistrationSchema.parse(input))).rejects.toBeInstanceOf(ActiveAccessRequestExistsException);
    expect(prisma.accessRequest.create).not.toHaveBeenCalled();
  });

  it.each([
    ['P2002', ActiveAccessRequestExistsException],
    ['P2025', AccessRequestCatalogMissingException],
  ] as const)('maps database failure %s without leaving a partial account', async (code, exception) => {
    const { repository, prisma } = build();
    prisma.accessRequest.create.mockRejectedValue(new Prisma.PrismaClientKnownRequestError('Database failure', { code, clientVersion: '7.10.0' }));
    const { password: _password, ...data } = directRegistrationSchema.parse(input);
    await expect(repository.create(data, 'hash')).rejects.toBeInstanceOf(exception);
  });
});
