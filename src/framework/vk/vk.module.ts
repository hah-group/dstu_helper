import { DynamicModule, Global, Module } from '@nestjs/common';
import { VK_OPTIONS } from './constants';
import { VkModuleOptions } from './vk-module.options';
import { VkService } from './vk.service';
import { BullModule } from '@nestjs/bull';
import { VkProducer } from './job/vk.producer';
import { VkConsumer } from './job/vk.consumer';
import { UserModule } from '../../modules/user/user.module';
import { BotExceptionModule } from '../bot-exception/bot-exception.module';
import { VkNewService } from './vk-new.service';
import { BotModule } from '../bot/bot.module';

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
        VkNewService,
        VkProducer,
        VkConsumer,
        VkService,
      ],
      exports: [VkService],
      imports: [
        BullModule.registerQueue({
          name: 'vk',
          limiter: {
            max: 20,
            duration: 1000,
          },
        }),
        UserModule,
        BotExceptionModule,
        BotModule,
      ],
    };
  }
}
