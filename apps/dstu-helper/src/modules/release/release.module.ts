import { Module } from '@nestjs/common';

import { ConversationModule } from '../conversation/conversation.module';
import { ReleaseController } from './release.controller';

@Module({
  controllers: [ReleaseController],
  imports: [ConversationModule],
})
export class ReleaseModule {}
