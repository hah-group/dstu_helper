import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { BotMetadataAccessor } from './bot-metadata.accessor';
import { BotHandler } from '../type/bot-handler.type';
import { BotService } from '../../bot.service';

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
        this.metadataScanner.scanFromPrototype(instance, prototype, (methodKey: string) => {
          this.connectHandler(instance, methodKey, prototype);
        });
      });
  }

  private connectHandler(instance: Record<string, any>, methodKey: string, prototype: any) {
    const metadata = this.metadataAccessor.getBotHandlerDecorator(instance[methodKey]);
    const filter = this.metadataAccessor.getBotFilterDecorator(instance[methodKey]);
    const params = this.metadataAccessor.getParamsDecorator(prototype, methodKey);
    if (!metadata) return;

    const extraParamsSorted = params.sort((a, b) => a.index - b.index);

    const handler: BotHandler = {
      check: (payload, context) => {
        return metadata.checkers.every((checker) => checker.check(payload, context));
      },
      filter: (context) => {
        return filter ? filter.filters.some((filter) => filter.check(context)) : true;
      },
      callback: async (context) => {
        const extraParams = extraParamsSorted.map((param) => param.factory(context));
        try {
          await instance[methodKey].call(instance, context, ...extraParams);
        } catch (e) {
          throw e;
        }
      },
      hasEvent: metadata.hasEvent,
      allowNext: metadata.allowNext || false,
    };

    this.botService.registerHandler(handler);
  }
}
