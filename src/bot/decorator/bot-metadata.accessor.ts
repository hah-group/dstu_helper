import { Injectable, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BOT_MESSAGE_LISTENER_METADATA, OnMessageMetadata } from './on-message.decorator';
import { BOT_INVITE_LISTENER_METADATA } from './on-invite.decorator';
import { BOT_KICK_LISTENER_METADATA } from './on-kick.decorator';

@Injectable()
export class BotMetadataAccessor {
  constructor(private readonly reflector: Reflector) {}

  getKickHandlerMetadata(target: Type<unknown>): boolean | undefined {
    return this.reflector.get(BOT_KICK_LISTENER_METADATA, target);
  }

  getInviteHandlerMetadata(target: Type<unknown>): 'user' | 'iam' | undefined {
    return this.reflector.get(BOT_INVITE_LISTENER_METADATA, target);
  }

  getMessageHandlerMetadata(target: Type<unknown>): OnMessageMetadata | undefined {
    return this.reflector.get(BOT_MESSAGE_LISTENER_METADATA, target);
  }
}
