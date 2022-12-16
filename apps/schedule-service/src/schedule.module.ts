import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseV2Module } from '@dstu_helper/common';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule as CronModule } from '@nestjs/schedule/dist/schedule.module';
import { ScheduleProviderModule } from './schedule-provider/schedule-provider.module';
import { ScheduleCacheController } from './schedule-cache.controller';
import { ScheduleCacheModule } from './cache/schedule-cache.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseV2Module.forRoot('schedule_service'),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    }),
    CronModule.forRoot(),
    ScheduleProviderModule,
    ScheduleCacheModule,
  ],
  controllers: [ScheduleCacheController],
})
export class ScheduleModule {}
