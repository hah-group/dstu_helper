import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

process.on('uncaughtException', function (err) {
  console.error(err);
});

process.on('unhandledRejection', function (err) {
  console.error(err);
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.ENV == 'dev' ? ['error', 'warn', 'log', 'verbose', 'debug'] : ['error', 'warn', 'log'],
  });
  await app.listen(3000);
}

bootstrap();
