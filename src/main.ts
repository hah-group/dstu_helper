import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log("Start APP (Internal)");
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

bootstrap();
