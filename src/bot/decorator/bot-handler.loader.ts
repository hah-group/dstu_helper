import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { BotMetadataAccessor } from './bot-metadata.accessor';
import { BotService } from '../bot.service';

@Injectable()
export class BotHandlerLoader implements OnApplicationBootstrap /*, OnApplicationShutdown*/ {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataAccessor: BotMetadataAccessor,
    private readonly metadataScanner: MetadataScanner,
    private readonly botService: BotService,
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
          this.subscribeToEventIfListener(instance, methodKey),
        );
      });
  }

  private subscribeToEventIfListener(instance: Record<string, any>, methodKey: string) {
    const eventListenerMetadata = this.metadataAccessor.getMessageHandlerMetadata(instance[methodKey]);
    if (!eventListenerMetadata) {
      return;
    }
    const { event, scope } = eventListenerMetadata;
    this.botService.addHandler((message) => instance[methodKey].call(instance, message), event, scope);
  }
}
