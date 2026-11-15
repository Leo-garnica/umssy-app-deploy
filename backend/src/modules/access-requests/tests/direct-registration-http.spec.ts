import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DomainExceptionFilter } from '../../../common/filters/domain-exception.filter.js';
import { ResponseInterceptor } from '../../../common/interceptors/response.interceptor.js';
import { DirectRegistrationController } from '../controllers/direct-registration.controller.js';
import { DirectRegistrationService } from '../services/direct-registration.service.js';
import { DirectRegistrationRepository } from '../repositories/direct-registration.repository.js';

const input = {
  firstName: 'Ana', lastName: 'Pérez', idCardNumber: '7654321',
  idCardIssuedIn: 'CB', sisCode: '201904512', email: 'ANA@EXAMPLE.COM',
  birthDate: '1999-01-01', graduationYear: 2024,
  career: 'Licenciatura en Ingeniería de Sistemas', password: 'Prueba2026',
};

describe('Direct registration HTTP contract', () => {
  let app: INestApplication | undefined;
  afterEach(async () => { await app?.close(); app = undefined; });

  async function build(enabled: boolean) {
    const repository = {
      ensureEmailAvailable: vi.fn().mockResolvedValue(undefined),
      create: vi.fn().mockResolvedValue({ id: 'new-user', email: 'ana@example.com' }),
    };
    const module = await Test.createTestingModule({
      controllers: [DirectRegistrationController],
      providers: [
        DirectRegistrationService,
        { provide: ConfigService, useValue: new ConfigService({ UMSSY_DEPLOYMENT_ENV: 'qa', ENABLE_DIRECT_REGISTRATION: String(enabled) }) },
        { provide: DirectRegistrationRepository, useValue: repository },
      ],
    }).compile();
    app = module.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new DomainExceptionFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());
    await app.init();
    return { server: app.getHttpServer(), repository };
  }

  it('accepts an unauthenticated registration and returns only the new account identifier and email', async () => {
    const { server, repository } = await build(true);
    const response = await request(server).post('/api/access-requests/direct-registration').send(input).expect(201);
    expect(response.body.data).toEqual({ id: 'new-user', email: 'ana@example.com' });
    expect(response.body).not.toHaveProperty('password');
    expect(repository.ensureEmailAvailable).toHaveBeenCalledWith('ana@example.com');
    expect(repository.create.mock.calls[0][0]).not.toHaveProperty('password');
  });

  it('returns field validation errors without creating an account', async () => {
    const { server, repository } = await build(true);
    const response = await request(server).post('/api/access-requests/direct-registration').send({ ...input, password: 'weak' }).expect(400);
    expect(response.body.errors).toContainEqual(expect.objectContaining({ field: 'password' }));
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('returns 404 when disabled even if the client submits directly to the API', async () => {
    const { server, repository } = await build(false);
    await request(server).post('/api/access-requests/direct-registration').send(input).expect(404);
    expect(repository.create).not.toHaveBeenCalled();
  });
});
