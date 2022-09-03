import { Checker } from './checker.type';
import { BotPayloadType } from '../type/bot-payload-type.enum';
import { BotContext, BotContextPayload, BotMessagePayload } from '../type/bot-context.type';
import { HandlerMetadata } from '../decorator/bot-handler.type';

export class ChatEventChecker extends Checker {
  constructor(metadata: HandlerMetadata) {
    super(metadata);
  }

  public check(payload: BotContextPayload, context: Omit<BotContext, 'payload'>): boolean {
    if (this.metadata.type != BotPayloadType.CHAT_EVENT) return true;

    return true;
  }
}
