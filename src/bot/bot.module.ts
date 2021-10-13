import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { DstuModule } from '../dstu/dstu.module';
import { BotController } from './bot.controller';
import { StudyGroupModule } from '../study-group/study-group.module';
import { BullModule } from '@nestjs/bull';
import { BotProducer } from './bot.producer';
import { BotConsumer } from './bot.consumer';

@Module({
  providers: [BotService, BotProducer, BotConsumer],
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
  ],
  controllers: [BotController],
  exports: [BotService],
})
export class BotModule {}
