import { SCHEDULE_SERVICE } from '@dstu_helper/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ScheduleModule } from './schedule.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ScheduleModule, {
    transport: Transport.RMQ,
    options: {
      urls: [<string>process.env.RABBITMQ_URL],
      queue: SCHEDULE_SERVICE,
    },
  });
  await app.listen();
}

bootstrap();
