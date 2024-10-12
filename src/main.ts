import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { envs } from 'src/config';
import { RpcCustomExceptionFilter } from 'src/common/exceptions';

async function bootstrap() {
  const logger = new Logger('Main-Gateway');

  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // transforma los datos de entrada a los tipos definidos en los DTOs
    forbidNonWhitelisted: true, // lanza un error si hay datos en el body que no están definidos en el DTO
    whitelist: true, // elimina los datos del body que no están definidos en el DTO
  }));

  app.useGlobalFilters(new RpcCustomExceptionFilter());

  await app.listen(envs.port);

  logger.log(`Gateway running on port ${envs.port}`);
}
bootstrap();
