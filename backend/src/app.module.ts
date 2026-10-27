import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConfigModule } from '@nestjs/config';
import { DomainExceptionFilter } from './common/filters/domain-exception.filter.js';
import { AvailabilityModule } from './modules/availability/availability.module.js';
import { PrismaModule } from './common/prisma/prisma.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { ProfileModule } from './modules/profile/profile.module.js';
import { CertificationDocumentsModule } from './modules/certification-documents/certification-documents.module.js';
import { CertificationsModule } from './modules/certifications/certifications.module.js';
import { CvModule } from './modules/cv/cv.module.js';
import { EducationsModule } from './modules/educations/educations.module.js';
import { SkillsModule } from './modules/skills/skills.module.js';
import { WorkExperienceModule } from './modules/work-experience/work-experience.module.js';
import { NlpModule } from './modules/nlp/nlp.module.js';
import { RadarIntegrationModule } from './modules/radar-integration/radar-integration.module.js';
import { JobOffersModule } from './modules/job-offers/job-offers.module.js';
import { MatchingModule } from './modules/matching/matching.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AvailabilityModule,
    AuthModule,
    ProfileModule,
    CvModule,
    SkillsModule,
    EducationsModule,
    WorkExperienceModule,
    CertificationsModule,
    CertificationDocumentsModule,
    NlpModule,
    RadarIntegrationModule,
    JobOffersModule,
    MatchingModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
  ],
})
export class AppModule {}
