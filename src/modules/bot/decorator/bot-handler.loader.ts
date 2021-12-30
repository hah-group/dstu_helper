import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { BotMetadataAccessor } from './bot-metadata.accessor';
import { VkService } from '../../vk/vk.service';
import { TelegramService } from '../../telegram/telegram.service';
import { Handler } from './handler-metadata.type';

@Injectable()
export class BotHandlerLoader implements OnApplicationBootstrap /*, OnApplicationShutdown*/ {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataAccessor: BotMetadataAccessor,
    private readonly metadataScanner: MetadataScanner,
    private readonly vkService: VkService,
    private readonly telegramService: TelegramService,
  ) {}

  onApplicationBootstrap() {
    this.loadEventListeners();
  }

  loadEventListeners() {
    const providers = this.discoveryService.getProviders();
    const controllers = this.discoveryService.getControllers();
    [...providers, ...controllers]
      .filter((wrapper) => wrapper.isDependencyTreeStatic())
      .filter((wrapper) => wrapper.instance)
      .forEach((wrapper: InstanceWrapper) => {
        const { instance } = wrapper;

        const prototype = Object.getPrototypeOf(instance);
        this.metadataScanner.scanFromPrototype(instance, prototype, (methodKey: string) =>
          this.connectHandler(instance, methodKey),
        );
      });
  }

  private connectHandler(instance: Record<string, any>, methodKey: string) {
    const metadata = this.metadataAccessor.getBotHandlerDecorator(instance[methodKey]);
    if (!metadata) return;

    const userStageMetadata = this.metadataAccessor.getBotUserAccessorDecorator(instance[methodKey]);

    const data: Handler = {
      ...metadata,
      userStage: userStageMetadata,
      callback: async (message) => {
        try {
          await instance[methodKey].call(instance, message);
        } catch (e) {
          throw e;
        }
      },
    };

    this.vkService.addHandler(data);
    this.telegramService.addHandler(data);
  }
}
