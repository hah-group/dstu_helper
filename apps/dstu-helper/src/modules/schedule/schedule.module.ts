import { Module } from '@nestjs/common';

import { ScheduleCacheModule } from './cache/schedule-cache.module';
import { ScheduleProviderModule } from './schedule-provider/schedule-provider.module';

@Module({
  imports: [ScheduleProviderModule, ScheduleCacheModule],
})
export class ScheduleModule {}
