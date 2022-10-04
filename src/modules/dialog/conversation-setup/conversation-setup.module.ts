import { Module } from '@nestjs/common';
import { ConversationSetupHandler } from './conversation-setup.handler';
import { ScheduleModule } from '../../schedule/schedule.module';
import { ConversationModule } from '../../conversation/conversation.module';
import { SceneService } from '../../../framework/scene/scene.service';
import { SceneModule } from '../../../framework/scene/scene.module';

@Module({
  imports: [ScheduleModule, ConversationModule, SceneModule],
  providers: [ConversationSetupHandler],
})
export class ConversationSetupModule {}
