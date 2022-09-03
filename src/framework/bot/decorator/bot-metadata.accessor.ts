import { Injectable, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HandlerMetadata } from './handler-metadata.type';
import { UserStage } from '../../../modules/user/user-stage.enum';

export const BOT_HANDLER = 'BOT_HANDLER';
export const BOT_USER_ACCESSOR = 'BOT_USER_ACCESSOR';

@Injectable()
export class BotMetadataAccessor {
  constructor(private readonly reflector: Reflector) {}

  public getBotHandlerDecorator(target: Type<unknown>): HandlerMetadata | undefined {
    return this.reflector.get(BOT_HANDLER, target);
  }

  public getBotUserAccessorDecorator(target: Type<unknown>): UserStage | undefined {
    return this.reflector.get(BOT_USER_ACCESSOR, target);
  }
}
