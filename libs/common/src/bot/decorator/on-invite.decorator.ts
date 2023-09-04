import { SetMetadata } from '@nestjs/common';

import { ChatInviteEventChecker } from '../checker/chat-invite-event.checker';
import { HandlerTypeChecker } from '../checker/handler-type.checker';
import { BotPayloadType } from '../type';
import { BOT_HANDLER } from './accessor/contains';
import { HandlerDecoratorMetadata, HandlerMetadata } from './type/bot-handler.type';

export const OnInvite = (scope: 'iam' | 'user'): MethodDecorator => {
  const metadata: HandlerMetadata = { type: BotPayloadType.CHAT_EVENT, scope: scope };
  return SetMetadata<string, HandlerDecoratorMetadata>(BOT_HANDLER, {
    checkers: [new HandlerTypeChecker(metadata), new ChatInviteEventChecker(metadata)],
    hasEvent: true,
  });
};
