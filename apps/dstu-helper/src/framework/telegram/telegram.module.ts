import { BotModule } from '@dstu_helper/common';
import { BullModule } from '@nestjs/bull';
import { DynamicModule, Global, Module } from '@nestjs/common';

import { BotExceptionModule } from '../bot-exception/bot-exception.module';
import { TG_OPTIONS } from './constants';
import { TelegramConsumer } from './job/telegram.consumer';
import { TelegramProducer } from './job/telegram.producer';
import { TelegramService } from './telegram.service';
import { TelegramModuleOptions } from './telegram-module.options';

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
