import { BaseMiddleware, BotContext, ChatUser } from '@dstu_helper/common';
import { User } from 'node-telegram-bot-api';
import { DeepPartial } from 'ts-essentials';

import { TelegramContext } from '../telegram.service';

export class UserMiddleware extends BaseMiddleware<TelegramContext> {
  public static Parse(user: User): Omit<ChatUser, 'user'> {
    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      nickname: user.username,
    };
  }

  public middleware(event: TelegramContext): DeepPartial<BotContext> | undefined {
    const from = event.ctx.from;
    if (!from) return;
    return {
      from: UserMiddleware.Parse(from),
    };
  }
}
