import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
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
        this.metadataScanner.scanFromPrototype(instance, prototype, (methodKey: string) => {
          this.subscribeToMessageEventIfListener(instance, methodKey);
          this.subscribeToInviteEventIfListener(instance, methodKey);
          this.subscribeToKickEventIfListener(instance, methodKey);
          this.subscribeToPayloadEventIfListener(instance, methodKey);
        });
      });
  }

  private subscribeToMessageEventIfListener(instance: Record<string, any>, methodKey: string) {
    const eventListenerMetadata = this.metadataAccessor.getMessageHandlerMetadata(instance[methodKey]);
    if (!eventListenerMetadata) return;

    const { event, scope } = eventListenerMetadata;
    this.botService.addMessageHandler((message) => instance[methodKey].call(instance, message), event, scope);
  }

  private subscribeToInviteEventIfListener(instance: Record<string, any>, methodKey: string) {
    const eventListenerMetadata = this.metadataAccessor.getInviteHandlerMetadata(instance[methodKey]);
    if (!eventListenerMetadata) return;

    this.botService.addInviteHandler((message) => instance[methodKey].call(instance, message), eventListenerMetadata);
  }

  private subscribeToKickEventIfListener(instance: Record<string, any>, methodKey: string) {
    const eventListenerMetadata = this.metadataAccessor.getKickHandlerMetadata(instance[methodKey]);
    if (!eventListenerMetadata) return;

    this.botService.addKickHandler((message) => instance[methodKey].call(instance, message));
  }

  private subscribeToPayloadEventIfListener(instance: Record<string, any>, methodKey: string) {
    const eventListenerMetadata = this.metadataAccessor.getPayloadHandlerMetadata(instance[methodKey]);
    if (!eventListenerMetadata) return;

    this.botService.addPayloadHandler((message) => instance[methodKey].call(instance, message), eventListenerMetadata);
  }
}
