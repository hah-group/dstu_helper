import { Injectable, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HandlerDecoratorMetadata } from '../type/bot-handler.type';
import { FilterDecoratorMetadata } from '../type/bot-filter.type';
import { ParamDecoratorMetadata } from '../type/bot-param.type';

export const BOT_HANDLER = 'BOT_HANDLER';
export const BOT_FILTER = 'BOT_FILTER';
export const BOT_PARAMS = 'BOT_PARAMS';

@Injectable()
export class BotMetadataAccessor {
  constructor(private readonly reflector: Reflector) {}

  public getBotHandlerDecorator(target: Type<unknown>): HandlerDecoratorMetadata | undefined {
    return this.reflector.get(BOT_HANDLER, target);
  }

  public getBotFilterDecorator(target: Type<unknown>): FilterDecoratorMetadata | undefined {
    return this.reflector.get(BOT_FILTER, target);
  }

  public getParamsDecorator(target: Type<unknown>, methodKey: string): ParamDecoratorMetadata {
    return Reflect.getMetadata(BOT_PARAMS, target.constructor, methodKey) || [];
  }
}
