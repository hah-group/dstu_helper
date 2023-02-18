import { SceneModule } from '@dstu_helper/common';
import { Module } from '@nestjs/common';

import { ConversationModule } from '../../conversation/conversation.module';
import { GroupModule } from '../../schedule/group/group.module';
import { ConversationSetupHandler } from './conversation-setup.handler';

@Module({
  imports: [GroupModule, ConversationModule, SceneModule],
  providers: [ConversationSetupHandler],
})
export class ConversationSetupModule {}
