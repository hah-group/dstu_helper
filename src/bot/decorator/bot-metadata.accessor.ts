import { Injectable, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BOT_MESSAGE_LISTENER_METADATA, OnMessageMetadata } from './on-message.decorator';

@Injectable()
export class BotMetadataAccessor {
  constructor(private readonly reflector: Reflector) {}

  getMessageHandlerMetadata(target: Type<unknown>): OnMessageMetadata | undefined {
    return this.reflector.get(BOT_MESSAGE_LISTENER_METADATA, target);
  }
}
