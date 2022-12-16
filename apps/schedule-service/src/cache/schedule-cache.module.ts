import { Module } from '@nestjs/common';
import { ScheduleCacheService } from './schedule-cache.service';
import { ScheduleCronService } from './schedule-cron.service';
import { GroupModule } from '../group/group.module';
import { LessonModule } from '../lesson/lesson.module';
import { ScheduleProviderModule } from '../schedule-provider/schedule-provider.module';

@Module({
  imports: [GroupModule, LessonModule, ScheduleProviderModule],
  providers: [ScheduleCacheService, ScheduleCronService],
  exports: [ScheduleCacheService],
})
export class ScheduleCacheModule {}
