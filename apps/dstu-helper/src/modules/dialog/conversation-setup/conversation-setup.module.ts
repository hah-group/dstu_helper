import { Module } from '@nestjs/common';
import { ConversationSetupHandler } from './conversation-setup.handler';
import { ConversationModule } from '../../conversation/conversation.module';
import { SceneModule } from '../../../framework/scene/scene.module';
import { GroupModule } from '../../schedule/group/group.module';

@Module({
  imports: [GroupModule, ConversationModule, SceneModule],
  providers: [ConversationSetupHandler],
})
export class ConversationSetupModule {}
