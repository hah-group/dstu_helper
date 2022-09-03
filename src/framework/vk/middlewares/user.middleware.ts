import { BaseMiddleware } from '../../bot/base.middleware';
import { DeepPartial } from 'ts-essentials';
import { BotContext } from '../../bot/type/bot-context.type';

export class UserMiddleware extends BaseMiddleware {
  public middleware(ctx: any): DeepPartial<BotContext> {
    return {
      from: {
        id: ctx.message.from_id || ctx.message.user_id,
      },
    };
  }
}
