import { DynamicModule, Global, Module } from '@nestjs/common';
import { TelegramModuleOptions } from './telegram-module.options';
import { TG_OPTIONS } from './constants';
import { BullModule } from '@nestjs/bull';
import { TelegramProducer } from './job/telegram.producer';
import { TelegramConsumer } from './job/telegram.consumer';
import { BotExceptionModule } from '../bot-exception/bot-exception.module';
import { TelegramService } from './telegram.service';
import { BotModule } from '../bot/bot.module';

@Global()
@Module({})
export class TelegramModule {
  static registerAsync(options: TelegramModuleOptions): DynamicModule {
    return {
      module: TelegramModule,
      providers: [
        {
          provide: TG_OPTIONS,
          useValue: options,
        },
        TelegramService,
        TelegramProducer,
        TelegramConsumer,
      ],
      imports: [
        BullModule.registerQueue({
          name: 'telegram',
          limiter: {
            max: 30,
            duration: 1000,
          },
        }),
        BotExceptionModule,
        BotModule,
      ],
    };
  }
}
