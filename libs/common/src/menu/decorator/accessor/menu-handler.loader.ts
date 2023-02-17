import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { MenuMetadataAccessor } from './menu-metadata.accessor';
import { MenuHandlerService } from './menu-handler.service';
import { MenuEnterHandler, ValueHandler } from './type/menu-handler.type';

@Injectable()
export class MenuHandlerLoader implements OnApplicationBootstrap {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly metadataAccessor: MenuMetadataAccessor,
    private readonly metadataScanner: MetadataScanner,
    private readonly menuHandlerService: MenuHandlerService,
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
          this.connectMenuEnterHandler(instance, methodKey, prototype);
          this.connectValueHandler(instance, methodKey, prototype);
        });
      });
  }

  //TODO Refactor (Убрать повторяющиеся части кода)
  private connectMenuEnterHandler(instance: Record<string, any>, methodKey: string, prototype: any) {
    const metadata = this.metadataAccessor.getMenuEnterDecorator(instance[methodKey]);
    const params = this.metadataAccessor.getParamsDecorator(prototype, methodKey);
    if (metadata) {
      const extraParamsSorted = params.sort((a, b) => a.index - b.index);
      const handler: MenuEnterHandler = async (botCtx, menuCtx) => {
        const extraParams = extraParamsSorted.map((param) => param.factory(menuCtx, metadata.path));
        return instance[methodKey].call(instance, botCtx, ...extraParams);
      };

      this.menuHandlerService.registerMenuEnterHandler(metadata.path, handler);
    }
  }

  private connectValueHandler(instance: Record<string, any>, methodKey: string, prototype: any) {
    const metadata = this.metadataAccessor.getValueDecorator(instance[methodKey]);
    const params = this.metadataAccessor.getParamsDecorator(prototype, methodKey);
    if (metadata) {
      const extraParamsSorted = params.sort((a, b) => a.index - b.index);
      const handler: ValueHandler = async (botCtx, menuCtx) => {
        const extraParams = extraParamsSorted.map((param) => param.factory(menuCtx, metadata.path));
        return instance[methodKey].call(instance, botCtx, ...extraParams);
      };

      this.menuHandlerService.registerValueHandler(metadata.path, handler);
    }
  }
}
