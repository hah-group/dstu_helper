import { Checker } from './checker.type';
import { BotPayloadType } from '../type/bot-payload-type.enum';
import { BotContext, BotInlineKeyPayload, BotMessagePayload } from '../type/bot-context.type';
import { OnMessageEventItem } from '../decorator/on-message.decorator';
import { HandlerMetadata } from '../decorator/bot-handler.type';

export class InlineButtonChecker extends Checker<BotInlineKeyPayload> {
  constructor(metadata: HandlerMetadata) {
    super(metadata);
  }

  public check(payload: BotInlineKeyPayload, context: Omit<BotContext, 'payload'>): boolean {
    if (this.metadata.type != BotPayloadType.INLINE_KEY) return true;
    return this.metadata.id == payload.key;
  }
}
