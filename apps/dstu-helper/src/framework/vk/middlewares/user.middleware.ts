import { BaseMiddleware, BotContext } from '@dstu_helper/common';
import { DeepPartial } from 'ts-essentials';

export class UserMiddleware extends BaseMiddleware {
  public middleware(ctx: any): DeepPartial<BotContext> {
    return {
      from: {
        id: ctx.message.from_id || ctx.message.user_id,
      },
    };
  }
}
