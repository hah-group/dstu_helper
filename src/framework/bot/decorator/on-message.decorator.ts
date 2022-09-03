import { SetMetadata } from '@nestjs/common';
import { DecoratorMetadata, HandlerMetadata } from './bot-handler.type';
import { BOT_HANDLER } from './bot-metadata.accessor';
import { BotMessagePayload, ChatScope } from '../type/bot-context.type';
import { BotPayloadType } from '../type/bot-payload-type.enum';
import { ChatScopeChecker } from '../checker/chat-scope.checker';
import { MessageMatchChecker } from '../checker/message-match.checker';
import { HandlerTypeChecker } from '../checker/handler-type.checker';

export type OnMessageEventType = OnMessageEventItem | OnMessageEventItem[];
export type OnMessageEventItem = string | RegExp | Text;

export const OnMessage = (event?: OnMessageEventType, scope?: ChatScope): MethodDecorator => {
  const metadata: HandlerMetadata = {
    type: BotPayloadType.MESSAGE,
    event: event,
    scope: scope,
  };

  return SetMetadata<string, DecoratorMetadata>(BOT_HANDLER, {
    checkers: [new HandlerTypeChecker(metadata), new ChatScopeChecker(metadata), new MessageMatchChecker(metadata)],
  });
};
