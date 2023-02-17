import { Checker } from './checker.type';
import { BotPayloadType } from '../type/bot-payload-type.enum';
import { BotChatEventPayload, BotContext } from '../type/bot-context.type';
import { HandlerMetadata } from '../decorator/type/bot-handler.type';

export class ChatInviteEventChecker extends Checker {
  constructor(metadata: HandlerMetadata) {
    super(metadata);
  }

  public check(payload: BotChatEventPayload, context: Omit<BotContext, 'payload'>): boolean {
    if (this.metadata.type != BotPayloadType.CHAT_EVENT) return true;

    if (payload.eventType != 'invite') return false;
    const ids = payload.members.map((chatUser) => chatUser.id);
    return (this.metadata.scope == 'iam') == ids.includes(context.botId);
  }
}
