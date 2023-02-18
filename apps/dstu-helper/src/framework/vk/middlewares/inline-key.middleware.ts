import { BaseMiddleware, BotContext, BotPayloadType } from '@dstu_helper/common';
import { DeepPartial } from 'ts-essentials';

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
