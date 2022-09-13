import { Module } from '@nestjs/common';
import { BotHandlerLoader } from './decorator/bot-handler.loader';
import { DiscoveryModule } from '@nestjs/core';
import { BotMetadataAccessor } from './decorator/bot-metadata.accessor';
import { BotService } from './bot.service';
import { UserModule } from '../../modules/user/user.module';

@Module({
  providers: [BotHandlerLoader, BotMetadataAccessor, BotService],
  imports: [DiscoveryModule, UserModule],
  exports: [BotService],
})
export class BotModule {}
