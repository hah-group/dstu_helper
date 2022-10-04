import { NestFactory } from '@nestjs/core';
import * as i18n from 'i18n';
import { AppModule } from './app.module';
import * as path from 'path';

process.on('uncaughtException', function (err) {
  console.error(err);
});

process.on('unhandledRejection', function (err) {
  console.error(err);
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: process.env.FLAVOUR == 'dev' ? ['error', 'warn', 'log', 'verbose', 'debug'] : ['error', 'warn', 'log'],
  });
  await app.listen(3000);

  i18n.configure({
    locales: ['ru', 'en'],
    directory: path.join(__dirname, 'locales'),
  });
  i18n.setLocale('ru');
}

bootstrap();
