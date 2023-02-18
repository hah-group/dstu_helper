import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

//TODO Oh fuck FIX IT!!!
import { ConversationModule } from '../../../../apps/dstu-helper/src/modules/conversation/conversation.module';
import { UserModule } from '../../../../apps/dstu-helper/src/modules/user/user.module';
import { BotService } from './bot.service';
import { BotHandlerLoader } from './decorator/accessor/bot-handler.loader';
import { BotMetadataAccessor } from './decorator/accessor/bot-metadata.accessor';

@Module({
  providers: [BotHandlerLoader, BotMetadataAccessor, BotService],
  imports: [DiscoveryModule, UserModule, ConversationModule],
  exports: [BotService],
})
export class BotModule {}
