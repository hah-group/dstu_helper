import { Module } from '@nestjs/common';

import { AudienceModule } from '../audience/audience.module';
import { FacultyModule } from '../faculty/faculty.module';
import { GroupModule } from '../group/group.module';
import { LessonModule } from '../lesson/lesson.module';
import { ScheduleProviderModule } from '../schedule-provider/schedule-provider.module';
import { SubjectModule } from '../subject/subject.module';
import { TeacherModule } from '../teacher/teacher.module';
import { ScheduleCacheController } from './schedule-cache.controller';
import { ScheduleCacheService } from './schedule-cache.service';
import { ScheduleCronService } from './schedule-cron.service';

@Module({
  imports: [
    GroupModule,
    LessonModule,
    FacultyModule,
    AudienceModule,
    SubjectModule,
    TeacherModule,
    ScheduleProviderModule,
  ],
  providers: [ScheduleCacheService, ScheduleCronService],
  exports: [ScheduleCacheService],
  controllers: [ScheduleCacheController],
})
export class ScheduleCacheModule {}