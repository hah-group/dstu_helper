import { OnMessageEventType } from '../on-message.decorator';
import { BotBaseContext, BotContext, BotContextPayload, ChatScope } from '../../type/bot-context.type';
import { BotPayloadType } from '../../type/bot-payload-type.enum';
import { Checker } from '../../checker/checker.type';
import { BotHandlerContext } from '../../type/bot-message.type';

export type BotHandler = {
  check: (payload: BotContextPayload, context: BotBaseContext) => boolean;
  filter: (context: BotContext) => boolean;
  callback: (message: BotHandlerContext) => Promise<void>;
  hasEvent: boolean;
  allowNext: boolean;
};

export type HandlerMetadata = OnMessageMetadata | OnInlineButtonMetadata | OnInviteMetadata;

export interface HandlerDecoratorMetadata {
  checkers: Checker[];
  hasEvent: boolean;
  allowNext?: boolean;
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
