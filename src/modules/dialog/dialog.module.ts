import { Module } from '@nestjs/common';
import { ConversationSetupModule } from './conversation-setup/conversation-setup.module';

@Module({
  imports: [ConversationSetupModule],
})
export class DialogModule {}
