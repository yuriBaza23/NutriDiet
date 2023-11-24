import { NestFactory } from '@nestjs/core';
import { AppModule } from './infra/app.module';
import { NutriDietLogger } from './infra/common/NutriDietLogger';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));
  app.enableCors();

  app.useLogger(new NutriDietLogger());
  await app.listen(3333);
}
bootstrap();
