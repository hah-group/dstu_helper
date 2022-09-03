import { SetMetadata } from '@nestjs/common';
import { BOT_HANDLER } from './bot-metadata.accessor';
import { DecoratorMetadata, HandlerMetadata, OnInlineButtonMetadata } from './bot-handler.type';
import { BotPayloadType } from '../type/bot-payload-type.enum';
import { HandlerTypeChecker } from '../checker/handler-type.checker';

export const OnInlineButton = (id: string): MethodDecorator => {
  const metadata: HandlerMetadata = {
    type: BotPayloadType.INLINE_KEY,
    id: id,
  };
  return SetMetadata<string, DecoratorMetadata>(BOT_HANDLER, {
    checkers: [new HandlerTypeChecker(metadata)],
  });
};
