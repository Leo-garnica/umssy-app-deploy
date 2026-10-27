import { randomUUID } from 'node:crypto';
import type { INestApplication } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { DomainExceptionFilter } from '../../../common/filters/domain-exception.filter.js';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import { EducationsModule } from '../../educations/educations.module.js';
import { SkillsModule } from '../../skills/skills.module.js';
import { WorkExperienceModule } from '../../work-experience/work-experience.module.js';
import { NlpModule } from '../nlp.module.js';
import { ProfileSkillsAnalysisService } from '../services/profile-skills-analysis.service.js';

// Opt in only against a disposable database whose name ends in _test: NLP_E2E_DATABASE must equal DB_NAME.
const DATABASE = process.env.NLP_E2E_DATABASE;
const TEST_TIMEOUT = 60_000;
const RESPONSE_BUDGET_MS = 3_000;
const CATALOG = ['Docker', 'Python', 'React', 'PostgreSQL', 'TypeScript'];
const jwt = new JwtService({ secret: 'nlp-pipeline-test-secret' });
const apps: INestApplication[] = [];
let prisma: PrismaService;
let userId: string;
let token: string;
let skillIds: Map<string, string>;

async function createApp(): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [NlpModule, SkillsModule, WorkExperienceModule, EducationsModule],
    providers: [{ provide: APP_FILTER, useClass: DomainExceptionFilter }],
  })
    .overrideProvider(JwtService)
    .useValue(jwt)
    .compile();
  const app = moduleRef.createNestApplication();
  app.setGlobalPrefix('api');
  await app.init();
  apps.push(app);
  return app;
}

const radar = async (app: INestApplication) =>
  (await request(app.getHttpServer()).get('/api/profile/skills-for-radar').set('Authorization', `Bearer ${token}`).expect(200)).body.data;

const names = (snapshot: { skills: { name: string; source: string }[] }) =>
  snapshot.skills.map((skill) => `${skill.name}:${skill.source}`);

describe.skipIf(!DATABASE)('NLP pipeline against a real database', () => {
  beforeAll(async () => {
    if (!DATABASE?.endsWith('_test') || process.env.DB_NAME !== DATABASE) {
      throw new Error('Use an explicitly confirmed, disposable DB_NAME ending in _test');
    }
    vi.spyOn(Logger.prototype, 'log').mockImplementation(() => undefined);
    const app = await createApp();
    prisma = app.get(PrismaService);

    const role = await prisma.role.upsert({ where: { name: 'titulado' }, create: { name: 'titulado' }, update: {} });
    const user = await prisma.user.create({
      data: { firstName: 'Prueba', lastName: 'NLP', email: `nlp-${randomUUID()}@test.umssy`, roles: { create: { roleId: role.id } } },
    });
    userId = user.id;
    token = jwt.sign({ sub: userId, roleTag: 'titulado' });
    skillIds = new Map();
    for (const name of CATALOG) {
      const skill = await prisma.skill.upsert({ where: { name }, create: { name, isCustom: false }, update: {} });
      skillIds.set(name, skill.id);
    }
  }, TEST_TIMEOUT);

  afterAll(async () => {
    if (userId) await prisma.user.delete({ where: { id: userId } });
    await Promise.all(apps.map((app) => app.close()));
    vi.restoreAllMocks();
  }, TEST_TIMEOUT);

  it('starts with an empty ready list for a profile without skills or texts', async () => {
    const app = apps[0];
    const response = await request(app.getHttpServer())
      .post('/api/profile/me/skills/analysis')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.data).toMatchObject({ userId, status: 'ready', version: 1, skills: [] });
  }, TEST_TIMEOUT);

  it('analyzes a saved work experience automatically and persists the result', async () => {
    const app = apps[0];
    const startedAt = performance.now();
    await request(app.getHttpServer())
      .post('/api/work-experiences')
      .set('Authorization', `Bearer ${token}`)
      .send({
        companyName: `Java Soft ${randomUUID().slice(0, 8)}`,
        position: 'Desarrolladora backend',
        startDate: '2024-01-01',
        isCurrent: true,
        description: 'APIs con Python y Docker; no usé Kubernetes. Quiero aprender TypeScript.',
      })
      .expect(201);
    const elapsed = performance.now() - startedAt;

    const snapshot = await radar(app);
    expect(elapsed).toBeLessThan(RESPONSE_BUDGET_MS);
    expect(snapshot.status).toBe('ready');
    expect(names(snapshot)).toEqual(['Docker:nlp', 'Python:nlp']);
    expect(snapshot.skills[0].evidenceRefs).toEqual([{ type: 'work-experience', id: expect.any(String) }]);

    const state = await prisma.profileSkillProcessingState.findUniqueOrThrow({ where: { userId } });
    expect(state).toMatchObject({ status: 'ready', inputRevision: 1, processedRevision: 1, dictionaryVersion: '1.0.0' });
    expect(Math.abs(state.updatedAt.getTime() - Date.now())).toBeLessThan(60_000);
  }, TEST_TIMEOUT);

  it('joins an education text and a manual skill, keeping one row per skill', async () => {
    const app = apps[0];
    await request(app.getHttpServer())
      .post('/api/educations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        institution: 'Universidad Mayor de San Simón (UMSS)',
        degree: 'Ingeniería Informática',
        startDate: '2018-01-01',
        endDate: '2023-12-01',
        description: 'Proyecto de grado con React y PostgreSQL.',
      })
      .expect(201);
    const saved = await request(app.getHttpServer())
      .put('/api/profile/me/skills')
      .set('Authorization', `Bearer ${token}`)
      .send({ skillIds: [skillIds.get('Python'), skillIds.get('TypeScript')] })
      .expect(200);

    expect(saved.body.data.map((skill: { name: string }) => skill.name)).toEqual(['Python', 'TypeScript']);
    const snapshot = await radar(app);
    expect(names(snapshot)).toEqual(['Docker:nlp', 'PostgreSQL:nlp', 'Python:manual', 'React:nlp', 'TypeScript:manual']);
    const python = snapshot.skills.find((skill: { name: string }) => skill.name === 'Python');
    expect(python).toMatchObject({ isHighRelevance: true, evidenceRefs: [{ type: 'work-experience', id: expect.any(String) }] });
    expect(await prisma.userSkill.count({ where: { userId } })).toBe(5);
  }, TEST_TIMEOUT);

  it('updates the list when the text changes and keeps the data in a new instance', async () => {
    const experience = await prisma.workExperience.findFirstOrThrow({ where: { userId } });
    await request(apps[0].getHttpServer())
      .patch(`/api/work-experiences/${experience.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'APIs con Python.' })
      .expect(200);

    const freshApp = await createApp();
    const snapshot = await radar(freshApp);
    expect(names(snapshot)).toEqual(['PostgreSQL:nlp', 'Python:manual', 'React:nlp', 'TypeScript:manual']);
  }, TEST_TIMEOUT);

  it('keeps a removed manual skill as detected while the text supports it', async () => {
    await request(apps[0].getHttpServer())
      .put('/api/profile/me/skills')
      .set('Authorization', `Bearer ${token}`)
      .send({ skillIds: [skillIds.get('TypeScript')] })
      .expect(200);

    expect(names(await radar(apps[0]))).toEqual(['PostgreSQL:nlp', 'Python:nlp', 'React:nlp', 'TypeScript:manual']);
  }, TEST_TIMEOUT);

  it('is idempotent: running it again changes only the processing date', async () => {
    const before = await radar(apps[0]);
    await new Promise((resolve) => setTimeout(resolve, 20));
    await request(apps[0].getHttpServer()).post('/api/profile/me/skills/analysis').set('Authorization', `Bearer ${token}`).expect(200);
    const after = await radar(apps[0]);

    expect(after.skills).toEqual(before.skills);
    expect(after.version).toBe(before.version);
    expect(new Date(after.updatedAt).getTime()).toBeGreaterThan(new Date(before.updatedAt).getTime());
  }, TEST_TIMEOUT);

  it('ends consistent after several concurrent changes', async () => {
    const services = [apps[0], apps[1]].map((app) => app.get(ProfileSkillsAnalysisService));
    await Promise.all(Array.from({ length: 6 }, (_, index) => services[index % 2].refreshAfterChange(userId)));

    const state = await prisma.profileSkillProcessingState.findUniqueOrThrow({ where: { userId } });
    const rows = await prisma.userSkill.findMany({ where: { userId } });
    expect(state.status).toBe('ready');
    expect(state.processedRevision).toBe(state.inputRevision);
    expect(new Set(rows.map((row) => row.skillId)).size).toBe(rows.length);
    expect(names(await radar(apps[0]))).toEqual(['PostgreSQL:nlp', 'Python:nlp', 'React:nlp', 'TypeScript:manual']);
  }, TEST_TIMEOUT);

  it('counts every first change of a new profile even when they arrive together', async () => {
    const role = await prisma.role.findUniqueOrThrow({ where: { name: 'titulado' } });
    const newUser = await prisma.user.create({
      data: { firstName: 'Prueba', lastName: 'Concurrente', email: `nlp-${randomUUID()}@test.umssy`, roles: { create: { roleId: role.id } } },
    });
    try {
      const services = [apps[0], apps[1]].map((app) => app.get(ProfileSkillsAnalysisService));
      await Promise.all(Array.from({ length: 4 }, (_, index) => services[index % 2].refreshAfterChange(newUser.id)));

      const state = await prisma.profileSkillProcessingState.findUniqueOrThrow({ where: { userId: newUser.id } });
      expect(state).toMatchObject({ status: 'ready', inputRevision: 4, processedRevision: 4 });
    } finally {
      await prisma.user.delete({ where: { id: newUser.id } });
    }
  }, TEST_TIMEOUT);

  it('removes the detected skills when their sources are deleted', async () => {
    const experience = await prisma.workExperience.findFirstOrThrow({ where: { userId } });
    const education = await prisma.education.findFirstOrThrow({ where: { userId } });
    await request(apps[0].getHttpServer()).delete(`/api/work-experiences/${experience.id}`).set('Authorization', `Bearer ${token}`).expect(200);
    await request(apps[0].getHttpServer()).delete(`/api/educations/${education.id}`).set('Authorization', `Bearer ${token}`).expect(200);

    expect(names(await radar(apps[0]))).toEqual(['TypeScript:manual']);
  }, TEST_TIMEOUT);
});
