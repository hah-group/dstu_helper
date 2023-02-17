import { SetMetadata } from '@nestjs/common';
import { HandlerDecoratorMetadata, HandlerMetadata } from './type/bot-handler.type';
import { BOT_HANDLER } from './accessor/bot-metadata.accessor';
import { ChatScope } from '../type/bot-context.type';
import { BotPayloadType } from '../type/bot-payload-type.enum';
import { ChatScopeChecker } from '../checker/chat-scope.checker';
import { MessageMatchChecker } from '../checker/message-match.checker';
import { HandlerTypeChecker } from '../checker/handler-type.checker';
import { Text } from '../../text/text';

export type OnMessageEventType = OnMessageEventItem | OnMessageEventItem[];
export type OnMessageEventItem = string | RegExp | Text | OnMessageFunction;
export type OnMessageFunction = (message: string) => boolean;

export const OnMessage = (event?: OnMessageEventType, scope?: ChatScope, allowNext = false): MethodDecorator => {
  const metadata: HandlerMetadata = {
    type: BotPayloadType.MESSAGE,
    event: event,
    scope: scope,
  };

  return SetMetadata<string, HandlerDecoratorMetadata>(BOT_HANDLER, {
    checkers: [new HandlerTypeChecker(metadata), new ChatScopeChecker(metadata), new MessageMatchChecker(metadata)],
    hasEvent: !!event,
    allowNext: allowNext,
  });
};
