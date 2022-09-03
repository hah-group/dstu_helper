import { SetMetadata } from '@nestjs/common';
import { OnMessageMetadata } from './handler-metadata.type';
import { EventType } from '../type/metadata-type.enum';
import { BOT_HANDLER } from './bot-metadata.accessor';
import { ProcessedTextInstance } from '../../../modules/util/text.processor';

export type OnMessageEventType = OnMessageEventItem | OnMessageEventItem[];
export type OnMessageEventItem = string | RegExp | ProcessedTextInstance;

export const OnMessage = (event?: OnMessageEventType, scope?: 'conversation' | 'private'): MethodDecorator =>
  SetMetadata(BOT_HANDLER, { event, scope, type: EventType.ON_MESSAGE } as OnMessageMetadata);
