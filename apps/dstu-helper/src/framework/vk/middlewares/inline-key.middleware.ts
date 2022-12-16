import { BaseMiddleware } from '../../bot/base.middleware';
import { DeepPartial } from 'ts-essentials';
import { BotContext } from '../../bot/type/bot-context.type';
import { BotPayloadType } from '../../bot/type/bot-payload-type.enum';

export class InlineKeyMiddleware extends BaseMiddleware {
  public middleware(ctx: any): DeepPartial<BotContext> | undefined {
    if (ctx.message.type == 'message_event') {
      return {
        payload: {
          type: BotPayloadType.INLINE_KEY,
          messageId: ctx.message.message_id || ctx.message.conversation_message_id,
          key: ctx.message.payload?.id,
        },
      };
    }
  }
}
