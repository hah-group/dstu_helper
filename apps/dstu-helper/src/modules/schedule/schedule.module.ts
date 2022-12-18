import { Module } from '@nestjs/common';
import { ScheduleProviderModule } from './schedule-provider/schedule-provider.module';
import { ScheduleCacheModule } from './cache/schedule-cache.module';

@Module({
  imports: [ScheduleProviderModule, ScheduleCacheModule],
})
export class ScheduleModule {}
