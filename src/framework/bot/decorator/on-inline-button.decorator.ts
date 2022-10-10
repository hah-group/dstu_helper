import { SetMetadata } from '@nestjs/common';
import { BOT_HANDLER } from './bot-metadata.accessor';
import { DecoratorMetadata, HandlerMetadata } from './bot-handler.type';
import { BotPayloadType } from '../type/bot-payload-type.enum';
import { HandlerTypeChecker } from '../checker/handler-type.checker';
import { KeyboardButton } from '../keyboard/keyboard-button';
import { InlineButtonChecker } from '../checker/inline-button.checker';

export const OnInlineButton = (button: KeyboardButton): MethodDecorator => {
  const metadata: HandlerMetadata = {
    type: BotPayloadType.INLINE_KEY,
    id: button.id,
  };
  return SetMetadata<string, DecoratorMetadata>(BOT_HANDLER, {
    checkers: [new HandlerTypeChecker(metadata), new InlineButtonChecker(metadata)],
  });
};
