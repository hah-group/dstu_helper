import { Module } from '@nestjs/common';
import { BotHandlerLoader } from './decorator/bot-handler.loader';
import { VkModule } from '../vk/vk.module';
import { TelegramModule } from '../telegram/telegram.module';
import { DiscoveryModule } from '@nestjs/core';
import { BotMetadataAccessor } from './decorator/bot-metadata.accessor';

@Module({
  providers: [BotHandlerLoader, BotMetadataAccessor],
  imports: [DiscoveryModule, VkModule, TelegramModule],
})
export class BotModule {}
