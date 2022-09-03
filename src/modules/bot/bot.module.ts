import { Module } from '@nestjs/common';
import { BotHandlerLoader } from './decorator/bot-handler.loader';
import { DiscoveryModule } from '@nestjs/core';
import { BotMetadataAccessor } from './decorator/bot-metadata.accessor';
import { BotService } from './bot.service';

@Module({
  providers: [BotHandlerLoader, BotMetadataAccessor, BotService],
  imports: [DiscoveryModule],
  exports: [BotService],
})
export class BotModule {}
