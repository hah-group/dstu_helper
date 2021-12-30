import { NestFactory } from '@nestjs/core';
import * as i18n from 'i18n';
import { AppModule } from './modules/app.module';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  console.log(path.join(__dirname, 'locales'));
  i18n.configure({
    locales: ['ru', 'en'],
    directory: path.join(__dirname, 'locales'),
  });

  i18n.setLocale('ru');
  console.log(
    i18n.__mf('TEST, what is', {
      name: 'Efim',
    }),
  );
}

bootstrap();
