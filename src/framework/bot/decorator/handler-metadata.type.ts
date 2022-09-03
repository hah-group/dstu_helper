import { EventType } from '../type/metadata-type.enum';
import { Message } from '../type/message.type';
import { UserStage } from '../../../modules/user/user-stage.enum';
import { OnMessageEventType } from './on-message.decorator';

export type Handler = HandlerMetadata & {
  callback: (message: Message) => Promise<void>;
  userStage?: UserStage;
};

export type HandlerMetadata = OnMessageMetadata | OnInlineButtonMetadata | OnInviteMetadata;

export interface OnMessageMetadata {
  type: EventType.ON_MESSAGE;
  event?: OnMessageEventType;
  scope?: 'conversation' | 'private';
}

export interface OnInlineButtonMetadata {
  type: EventType.ON_INLINE_BUTTON;
  id: string;
}

export interface OnInviteMetadata {
  type: EventType.ON_INVITE;
  scope: 'iam' | 'user';
}
