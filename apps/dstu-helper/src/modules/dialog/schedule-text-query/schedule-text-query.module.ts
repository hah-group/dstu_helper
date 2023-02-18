import { Module } from '@nestjs/common';

import { ConversationModule } from '../../conversation/conversation.module';
import { LessonModule } from '../../schedule/lesson/lesson.module';
import { ScheduleBuilder } from './schedule.builder';
import { ScheduleTextQueryHandler } from './schedule-text-query.handler';

@Module({
  imports: [ConversationModule, LessonModule],
  providers: [ScheduleTextQueryHandler, ScheduleBuilder],
  exports: [ScheduleBuilder],
})
export class ScheduleTextQueryModule {}
