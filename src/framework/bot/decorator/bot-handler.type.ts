import { UserStage } from '../../../modules/user/user-stage.enum';
import { OnMessageEventType } from './on-message.decorator';
import { BotContext, BotContextPayload, BotMessagePayload, ChatScope } from '../type/bot-context.type';
import { BotPayloadType } from '../type/bot-payload-type.enum';
import { Checker } from '../checker/checker.type';

export type BotHandler = DecoratorMetadata & {
  callback: (message: BotContext) => Promise<void>;
  userStage?: UserStage;
};

export type HandlerMetadata = OnMessageMetadata | OnInlineButtonMetadata | OnInviteMetadata;

export interface DecoratorMetadata {
  checkers: Checker[];
}

export interface OnMessageMetadata {
  type: BotPayloadType.MESSAGE;
  event?: OnMessageEventType;
  scope?: ChatScope;
}

export interface OnInlineButtonMetadata {
  type: BotPayloadType.INLINE_KEY;
  id: string;
}

export interface OnInviteMetadata {
  type: BotPayloadType.CHAT_EVENT;
  scope: 'iam' | 'user';
}
