import { SetMetadata } from '@nestjs/common';
import { DecoratorMetadata, HandlerMetadata } from './bot-handler.type';
import { BOT_HANDLER } from './bot-metadata.accessor';
import { ChatScope } from '../type/bot-context.type';
import { BotPayloadType } from '../type/bot-payload-type.enum';
import { ChatScopeChecker } from '../checker/chat-scope.checker';
import { MessageMatchChecker } from '../checker/message-match.checker';
import { HandlerTypeChecker } from '../checker/handler-type.checker';
import { KeyboardButton } from '../keyboard/keyboard-button';
import { OnMessageEventItem } from './on-message.decorator';

export type OnButtonEventType = KeyboardButton | KeyboardButton[];

/**
 * Это аналог {@link OnMessage @OnMessage} декоратора,
 * созданный для видимого разделения типов событий.
 *
 * С точки зрения соц. сетей - пользовательские клавиатуры не отличаются от обычных сообщений
 *
 * @param target {@link OnButtonEventType} - Кнопка (или массив кнопок) клавиатуры, на которые необходимо реагировать
 * @param scope {@link ChatScope} - Область реагирования
 */
export const OnButton = (target: OnButtonEventType, scope?: ChatScope): MethodDecorator => {
  let event: OnMessageEventItem[] = [];
  if (Array.isArray(target)) event = target.map((key) => key.id);
  else event.push(target.id);

  const metadata: HandlerMetadata = {
    type: BotPayloadType.MESSAGE,
    event: event,
    scope: scope,
  };

  return SetMetadata<string, DecoratorMetadata>(BOT_HANDLER, {
    checkers: [new HandlerTypeChecker(metadata), new ChatScopeChecker(metadata), new MessageMatchChecker(metadata)],
  });
};
