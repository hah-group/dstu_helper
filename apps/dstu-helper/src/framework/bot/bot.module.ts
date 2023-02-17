import { Module } from '@nestjs/common';
import { BotHandlerLoader } from './decorator/accessor/bot-handler.loader';
import { DiscoveryModule } from '@nestjs/core';
import { BotMetadataAccessor } from './decorator/accessor/bot-metadata.accessor';
import { BotService } from './bot.service';
import { UserModule } from '../../modules/user/user.module';
import { ConversationModule } from '../../modules/conversation/conversation.module';

@Module({
  providers: [BotHandlerLoader, BotMetadataAccessor, BotService],
  imports: [DiscoveryModule, UserModule, ConversationModule],
  exports: [BotService],
})
export class BotModule {}
