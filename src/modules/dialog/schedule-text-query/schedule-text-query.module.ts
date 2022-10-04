import { Module } from '@nestjs/common';
import { ScheduleTextQueryHandler } from './schedule-text-query.handler';
import { GroupModule } from '../../group/group.module';
import { ConversationModule } from '../../conversation/conversation.module';
import { ScheduleBuilder } from './schedule.builder';

@Module({
  imports: [ConversationModule],
  providers: [ScheduleTextQueryHandler, ScheduleBuilder],
  exports: [ScheduleBuilder],
})
export class ScheduleTextQueryModule {}
