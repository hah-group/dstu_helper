import { SetMetadata } from '@nestjs/common';
import { DecoratorMetadata, HandlerMetadata } from './bot-handler.type';
import { BOT_HANDLER } from './bot-metadata.accessor';
import { BotPayloadType } from '../type/bot-payload-type.enum';
import { HandlerTypeChecker } from '../checker/handler-type.checker';
import { ChatInviteEventChecker } from '../checker/chat-invite-event.checker';

export const OnInvite = (scope: 'iam' | 'user'): MethodDecorator => {
  const metadata: HandlerMetadata = { type: BotPayloadType.CHAT_EVENT, scope: scope };
  return SetMetadata<string, DecoratorMetadata>(BOT_HANDLER, {
    checkers: [new HandlerTypeChecker(metadata), new ChatInviteEventChecker(metadata)],
  });
};
