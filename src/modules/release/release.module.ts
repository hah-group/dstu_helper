import { Module } from '@nestjs/common';
import { ReleaseController } from './release.controller';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
  controllers: [ReleaseController],
  imports: [ConversationModule],
})
export class ReleaseModule {}
