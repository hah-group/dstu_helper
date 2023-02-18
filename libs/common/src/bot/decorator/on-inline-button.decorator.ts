import { SetMetadata } from '@nestjs/common';

import { HandlerTypeChecker } from '../checker/handler-type.checker';
import { InlineButtonChecker } from '../checker/inline-button.checker';
import { KeyboardButton } from '../keyboard';
import { BotPayloadType } from '../type';
import { BOT_HANDLER } from './accessor/bot-metadata.accessor';
import { HandlerDecoratorMetadata, HandlerMetadata } from './type/bot-handler.type';

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
