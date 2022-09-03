import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { BotMetadataAccessor } from './bot-metadata.accessor';
import { BotHandler } from './bot-handler.type';
import { BotService } from '../bot.service';

@Injectable()
export class BotHandlerLoader implements OnApplicationBootstrap /*, OnApplicationShutdown*/ {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataAccessor: BotMetadataAccessor,
    private readonly metadataScanner: MetadataScanner,
    private readonly botService: BotService,
  ) {}

  public onApplicationBootstrap() {
    this.loadEventListeners();
  }

  private loadEventListeners() {
    const providers = this.discoveryService.getProviders();
    providers
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

    const handler: BotHandler = {
      ...metadata,
      userStage: userStageMetadata,
      callback: async (context) => {
        try {
          await instance[methodKey].call(instance, context);
        } catch (e) {
          throw e;
        }
      },
    };

    this.botService.registerHandler(handler);
  }
}
