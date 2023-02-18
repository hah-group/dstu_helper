import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

import { REQUEST_QUEUE } from './constants';
import { RequestConsumer } from './job/request.consumer';
import { RequestProducer } from './job/request.producer';
import { ScheduleProviderService } from './schedule-provider.service';

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
