import { Module } from '@nestjs/common';
import { ConversationSetupHandler } from './conversation-setup.handler';

@Module({
  providers: [ConversationSetupHandler],
})
export class ConversationSetupModule {}
