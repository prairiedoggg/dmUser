import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { getConfig } from './config/env.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = getConfig();
  
  // 글로벌 유효성 검사 파이프 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS 설정
  app.enableCors({
    origin: config.cors.allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // API 버전 프리픽스 (선택사항)
  app.setGlobalPrefix('api/v1');

  await app.listen(config.port);
  console.log(`Application is running on: ${await app.getUrl()} (${config.nodeEnv} mode)`);
}
bootstrap();
