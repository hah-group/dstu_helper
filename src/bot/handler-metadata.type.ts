import { EventType } from './metadata-type.enum';
import { Message } from './message.type';

export type Handler = HandlerMetadata & {
  callback: (message: Message) => Promise<void>;
};

export type HandlerMetadata = OnMessageMetadata | OnInlineButtonMetadata;

export interface OnMessageMetadata {
  type: EventType.ON_MESSAGE;
  event?: string | RegExp | string[] | RegExp[];
  scope?: 'conversation' | 'private';
}

export interface OnInlineButtonMetadata {
  type: EventType.ON_INLINE_BUTTON;
  id: string;
}
