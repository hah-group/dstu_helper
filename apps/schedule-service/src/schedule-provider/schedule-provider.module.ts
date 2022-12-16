import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ScheduleProviderService } from './schedule-provider.service';
import { RequestProducer } from './job/request.producer';
import { RequestConsumer } from './job/request.consumer';
import { REQUEST_QUEUE } from './constants';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    BullModule.registerQueue({
      name: REQUEST_QUEUE,
    }),
    HttpModule,
  ],
  providers: [RequestProducer, RequestConsumer, ScheduleProviderService],
  exports: [ScheduleProviderService],
})
export class ScheduleProviderModule {}
