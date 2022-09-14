import { Module } from '@nestjs/common';
import { ScheduleProviderBuilder } from './schedule-provider.builder';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';
import { RequestProducer } from './job/request.producer';
import { RequestConsumer } from './job/request.consumer';
import { ScheduleController } from './schedule.controller';
import { GroupModule } from '../group/group.module';
import { LessonModule } from '../lesson/lesson.module';
import { ScheduleService } from './schedule.service';
import { TeacherModule } from '../teacher/teacher.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'schedule_request',
      limiter: {
        max: 2,
        duration: 1000,
      },
    }),
    HttpModule,
    GroupModule,
    LessonModule,
    TeacherModule,
  ],
  providers: [ScheduleProviderBuilder, RequestProducer, RequestConsumer, ScheduleService],
  controllers: [ScheduleController],
})
export class ScheduleModule {}
