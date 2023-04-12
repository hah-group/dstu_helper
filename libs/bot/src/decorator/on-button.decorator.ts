import { SetMetadata } from '@nestjs/common';

import { ChatScopeChecker } from '../checker/chat-scope.checker';
import { HandlerTypeChecker } from '../checker/handler-type.checker';
import { MessageMatchChecker } from '../checker/message-match.checker';
import { KeyboardButton } from '../keyboard';
import { BotPayloadType, ChatScope } from '../type';
import { BOT_HANDLER } from './accessor/contains';
import { OnMessageEventItem } from './on-message.decorator';
import { HandlerDecoratorMetadata, HandlerMetadata } from './type/bot-handler.type';

export type OnButtonEventType = KeyboardButton | KeyboardButton[];

/**
 * Это аналог {@link OnMessage @OnMessage} декоратора,
 * созданный для видимого разделения типов событий.
 *
 * С точки зрения соц. сетей - пользовательские клавиатуры не отличаются от обычных сообщений
 *
 * @param target {@link OnButtonEventType} - Кнопка (или массив кнопок) клавиатуры, на которые необходимо реагировать
 * @param scope {@link ChatScope} - Область реагирования
 * @param allowNext {boolean} - Разрешить передачу события другим обработчикам (next() из Express)
 */
export const OnButton = (target: OnButtonEventType, scope?: ChatScope, allowNext = false): MethodDecorator => {
  let event: OnMessageEventItem[] = [];
  if (Array.isArray(target)) event = target.map((key) => key.id);
  else event.push(target.id);

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
