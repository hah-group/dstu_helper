import { BaseMiddleware } from '../../bot/base.middleware';
import { DeepPartial } from 'ts-essentials';
import { BotContext } from '../../bot/type/bot-context.type';
import { TelegramContext } from '../telegram-new.service';

export class InlineKeyMiddleware extends BaseMiddleware<TelegramContext> {
  public middleware(event: TelegramContext): DeepPartial<BotContext> {
    if (event.type != 'callback_query') return;

    return {
      payload: {
        type: 'inline_key',
        key: event.ctx.data,
      },
    };
  }
}
