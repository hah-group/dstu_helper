import { Injectable, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MenuHandlerMetadata } from './type/menu-handler.metadata';
import { MenuValueParamDecoratorMetadata } from './type/menu-param.type';

export const MENU_ENTER = 'MENU_ENTER';
export const VALUE_INPUT = 'VALUE_INPUT';
export const MENU_PARAMS = 'MENU_PARAMS';

@Injectable()
export class MenuMetadataAccessor {
  constructor(private readonly reflector: Reflector) {}

  public getMenuEnterDecorator(target: Type<unknown>): MenuHandlerMetadata | undefined {
    return this.reflector.get(MENU_ENTER, target);
  }

  public getValueDecorator(target: Type<unknown>): MenuHandlerMetadata | undefined {
    return this.reflector.get(VALUE_INPUT, target);
  }

  public getParamsDecorator(target: Type<unknown>, methodKey: string): MenuValueParamDecoratorMetadata {
    return Reflect.getMetadata(MENU_PARAMS, target.constructor, methodKey) || [];
  }
}
