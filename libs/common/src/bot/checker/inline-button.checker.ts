import { HandlerMetadata } from '../decorator/type/bot-handler.type';
import { BotContext, BotInlineKeyPayload } from '../type/bot-context.type';
import { BotPayloadType } from '../type/bot-payload-type.enum';
import { Checker } from './checker.type';

export class InlineButtonChecker extends Checker<BotInlineKeyPayload> {
  constructor(metadata: HandlerMetadata) {
    super(metadata);
  }

  public check(payload: BotInlineKeyPayload, context: Omit<BotContext, 'payload'>): boolean {
    if (this.metadata.type != BotPayloadType.INLINE_KEY) return true;
    return this.metadata.id == payload.key;
  }
}
