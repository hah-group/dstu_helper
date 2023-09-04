import { Injectable, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { FilterDecoratorMetadata } from '../type/bot-filter.type';
import { HandlerDecoratorMetadata } from '../type/bot-handler.type';
import { ParamDecoratorMetadata } from '../type/bot-param.type';
import { BOT_FILTER, BOT_HANDLER, BOT_PARAMS } from './contains';

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
