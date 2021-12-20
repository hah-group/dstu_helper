import { Injectable, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HandlerMetadata } from './handler-metadata.type';

export const BOT_HANDLER = 'BOT_HANDLER';

@Injectable()
export class BotMetadataAccessor {
  constructor(private readonly reflector: Reflector) {}

  public getBotHandlerDecorator(target: Type<unknown>): HandlerMetadata | undefined {
    return this.reflector.get(BOT_HANDLER, target);
  }
}
