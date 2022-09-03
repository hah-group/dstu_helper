import { BaseMiddleware } from '../../bot/base.middleware';
import { DeepPartial } from 'ts-essentials';
import { BotContext, ChatUser } from '../../bot/type/bot-context.type';
import { User } from 'node-telegram-bot-api';
import { TelegramContext } from '../telegram-new.service';

export class UserMiddleware extends BaseMiddleware<TelegramContext> {
  public static Parse(user: User): ChatUser {
    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      nickname: user.username,
    };
  }

  public middleware(event: TelegramContext): DeepPartial<BotContext> {
    return {
      from: UserMiddleware.Parse(event.ctx.from),
    };
  }
}
