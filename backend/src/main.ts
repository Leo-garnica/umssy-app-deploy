import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { getCorsOrigins } from './common/config/cors-origins.js';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const corsOrigins = getCorsOrigins(process.env.CORS_ORIGIN);

  app.enableCors(corsOrigins.length > 0 ? { origin: corsOrigins } : {});
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('None')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(
    `[bootstrap] listening on port ${port}; cors origins=${
      corsOrigins.length > 0 ? corsOrigins.join(', ') : '(default: all origins)'
    }`,
  );
}

// Vercel captures server.listen() while importing this module and binds the
// server afterwards. Awaiting bootstrap here prevents that import from ending.
void bootstrap().catch((error: unknown) => {
  console.error('[bootstrap] FAILED', error);
  process.exit(1);
});
