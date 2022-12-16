import { Module } from '@nestjs/common';
import { ConversationSetupModule } from './conversation-setup/conversation-setup.module';
import { ScheduleTextQueryModule } from './schedule-text-query/schedule-text-query.module';
import { PrivateSetupModule } from './private/private-setup.module';

@Module({
  imports: [ConversationSetupModule, ScheduleTextQueryModule, PrivateSetupModule],
})
export class DialogModule {}
