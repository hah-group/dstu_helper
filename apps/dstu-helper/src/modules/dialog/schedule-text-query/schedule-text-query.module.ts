import { Module } from '@nestjs/common';
import { ScheduleTextQueryHandler } from './schedule-text-query.handler';
import { ConversationModule } from '../../conversation/conversation.module';
import { ScheduleBuilder } from './schedule.builder';
import { LessonModule } from '../../schedule/lesson/lesson.module';

@Module({
  imports: [ConversationModule, LessonModule],
  providers: [ScheduleTextQueryHandler, ScheduleBuilder],
  exports: [ScheduleBuilder],
})
export class ScheduleTextQueryModule {}
