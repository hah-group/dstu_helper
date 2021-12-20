import { SetMetadata } from '@nestjs/common';
import { OnMessageMetadata } from './handler-metadata.type';
import { EventType } from './metadata-type.enum';
import { BOT_HANDLER } from './bot-metadata.accessor';

export const OnMessage = (
  event?: string | RegExp | string[] | RegExp[],
  scope?: 'conversation' | 'private',
): MethodDecorator => SetMetadata(BOT_HANDLER, { event, scope, type: EventType.ON_MESSAGE } as OnMessageMetadata);
