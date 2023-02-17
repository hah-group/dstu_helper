import { SetMetadata } from '@nestjs/common';
import { BOT_HANDLER } from './accessor/bot-metadata.accessor';
import { HandlerDecoratorMetadata, HandlerMetadata } from './type/bot-handler.type';
import { BotPayloadType } from '../type/bot-payload-type.enum';
import { HandlerTypeChecker } from '../checker/handler-type.checker';
import { KeyboardButton } from '../keyboard/keyboard-button';
import { InlineButtonChecker } from '../checker/inline-button.checker';

export const OnInlineButton = (button: KeyboardButton): MethodDecorator => {
  const metadata: HandlerMetadata = {
    type: BotPayloadType.INLINE_KEY,
    id: button.id,
  };
  return SetMetadata<string, HandlerDecoratorMetadata>(BOT_HANDLER, {
    checkers: [new HandlerTypeChecker(metadata), new InlineButtonChecker(metadata)],
    hasEvent: true,
  });
};
