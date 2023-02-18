import { DynamicModule, Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { MENU_OPTIONS } from './constains';
import { MenuHandlerLoader } from './decorator/accessor/menu-handler.loader';
import { MenuHandlerService } from './decorator/accessor/menu-handler.service';
import { MenuMetadataAccessor } from './decorator/accessor/menu-metadata.accessor';
import { MenuService } from './menu.service';
import { MenuModuleOptions } from './menu-module.options';

@Module({})
export class MenuModule {
  static register(options: MenuModuleOptions): DynamicModule {
    return {
      module: MenuModule,
      imports: [DiscoveryModule],
      providers: [
        {
          provide: MENU_OPTIONS,
          useValue: options,
        },
        MenuService,
        MenuMetadataAccessor,
        MenuHandlerLoader,
        MenuHandlerService,
      ],
      exports: [MenuService],
    };
  }
}
