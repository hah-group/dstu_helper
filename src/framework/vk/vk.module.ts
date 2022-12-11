import { DynamicModule, Global, MiddlewareConsumer, Module } from '@nestjs/common';
import { VK_OPTIONS } from './constants';
import { VkModuleOptions } from './vk-module.options';
import { BullModule } from '@nestjs/bull';
import { VkProducer } from './job/vk.producer';
import { VkConsumer } from './job/vk.consumer';
import { BotExceptionModule } from '../bot-exception/bot-exception.module';
import { VkService } from './vk.service';
import { BotModule } from '../bot/bot.module';
import { VkBotController } from './vk-bot.controller';
import { VkBotMiddleware } from './vk-bot.middleware';

@Global()
@Module({})
export class VkModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(VkBotMiddleware).forRoutes('bot/vk');
  }

  static registerAsync(options: VkModuleOptions): DynamicModule {
    return {
      module: VkModule,
      providers: [
        {
          provide: VK_OPTIONS,
          useValue: options,
        },
        VkService,
        VkProducer,
        VkConsumer,
        VkBotMiddleware,
      ],
      imports: [
        BullModule.registerQueue({
          name: 'vk',
          limiter: {
            max: 20,
            duration: 1000,
          },
        }),
        BotExceptionModule,
        BotModule,
      ],
      controllers: [VkBotController],
    };
  }
}
