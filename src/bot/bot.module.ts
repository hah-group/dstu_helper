import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { DstuModule } from '../dstu/dstu.module';
import { BotController } from './bot.controller';
import { StudyGroupModule } from '../study-group/study-group.module';
import { BullModule } from '@nestjs/bull';
import { BotProducer } from './job/bot.producer';
import { BotConsumer } from './job/bot.consumer';
import { BotHandlerLoader } from './decorator/bot-handler.loader';
import { BotMetadataAccessor } from './decorator/bot-metadata.accessor';
import { DiscoveryModule } from '@nestjs/core';
import { SetupHandler } from './setup.handler';
import { ConversationModule } from '../conversation/conversation.module';
import { UserModule } from '../user/user.module';
import { LkHandler } from './lk.handler';
import { VkIoModule } from '../vk-io/vk-io.module';
import { UniversityModule } from '../university/university.module';
import { ScheduleHandler } from './schedule.handler';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  providers: [
    BotService,
    BotProducer,
    BotConsumer,
    BotHandlerLoader,
    BotMetadataAccessor,
    SetupHandler,
    LkHandler,
    ScheduleHandler,
  ],
  imports: [
    BullModule.registerQueue({
      name: 'bot',
      limiter: {
        max: 15,
        duration: 1000,
      },
    }),
    DstuModule,
    StudyGroupModule,
    DiscoveryModule,
    ConversationModule,
    UserModule,
    VkIoModule,
    UniversityModule,
    CacheModule,
  ],
  controllers: [BotController],
  exports: [BotService],
})
export class BotModule {}
