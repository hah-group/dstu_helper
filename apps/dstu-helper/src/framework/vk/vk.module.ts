import { BotModule } from '@dstu_helper/common';
import { BullModule } from '@nestjs/bull';
import { DynamicModule, Global, Module } from '@nestjs/common';

import { BotExceptionModule } from '../bot-exception/bot-exception.module';
import { VK_OPTIONS } from './constants';
import { VkConsumer } from './job/vk.consumer';
import { VkProducer } from './job/vk.producer';
import { VkService } from './vk.service';
import { VkModuleOptions } from './vk-module.options';

@Global()
@Module({})
export class VkModule {
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
    };
  }
}
