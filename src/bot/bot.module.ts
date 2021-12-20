import { Module } from '@nestjs/common';
import { BotHandlerLoader } from './bot-handler.loader';
import { VkModule } from '../vk/vk.module';
import { TelegramModule } from '../telegram/telegram.module';
import { DiscoveryModule } from '@nestjs/core';
import { BotMetadataAccessor } from './bot-metadata.accessor';
import { Test } from './test';

@Module({
  providers: [BotHandlerLoader, BotMetadataAccessor, Test],
  imports: [DiscoveryModule, VkModule, TelegramModule],
})
export class BotModule {}
