import { SetMetadata } from '@nestjs/common';
import { BOT_HANDLER } from './bot-metadata.accessor';
import { OnInlineButtonMetadata } from './handler-metadata.type';
import { EventType } from '../type/metadata-type.enum';

export const OnInlineButton = (id: string): MethodDecorator =>
  SetMetadata(BOT_HANDLER, {
    type: EventType.ON_INLINE_BUTTON,
    id: id,
  } as OnInlineButtonMetadata);
