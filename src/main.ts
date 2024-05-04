import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import fastifyMultipart from '@fastify/multipart';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  const config = app.get<ConfigService>(ConfigService);

  await app.register(fastifyMultipart, {
    limits: {
      files: 10,
      fileSize: 10000000,
    },
  });

  app.useStaticAssets({
    root: join(__dirname, '..', 'volumes'),
  });

  await app.listen(config.getOrThrow<number>('PORT'));
}

bootstrap();
