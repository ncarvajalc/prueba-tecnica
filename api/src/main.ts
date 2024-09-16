import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { BusinessLogicExceptionFilter } from './shared/filters/business-logic-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'api/v',
    defaultVersion: '1',
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new BusinessLogicExceptionFilter());
  await app.listen(3000);
}
bootstrap();
