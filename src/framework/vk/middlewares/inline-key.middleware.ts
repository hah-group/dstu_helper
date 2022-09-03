import { BaseMiddleware } from '../../bot/base.middleware';
import { DeepPartial } from 'ts-essentials';
import { BotContext } from '../../bot/type/bot-context.type';

export class InlineKeyMiddleware extends BaseMiddleware {
  public middleware(ctx: any): DeepPartial<BotContext> {
    if (ctx.message.type == 'message_event')
      return {
        payload: {
          type: 'inline_key',
          key: ctx.message.payload,
        },
      };
  }
}
