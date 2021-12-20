import { DynamicModule, Global, Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramModuleOptions } from './telegram-module.options';
import { TG_OPTIONS } from './constants';
import { BullModule } from '@nestjs/bull';
import { TelegramProducer } from './job/telegram.producer';
import { TelegramConsumer } from './job/telegram.consumer';

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
      exports: [TelegramService],
      imports: [
        BullModule.registerQueue({
          name: 'telegram',
          limiter: {
            max: 20,
            duration: 1000,
          },
        }),
      ],
    };
  }
}
