import { BaseMiddleware } from '../../bot/base.middleware';
import { DeepPartial } from 'ts-essentials';
import { BotContext } from '../../bot/type/bot-context.type';
import { TelegramContext, TelegramMessage } from '../telegram-new.service';

export class MessageMiddleware extends BaseMiddleware<TelegramContext> {
  public middleware(event: TelegramContext): DeepPartial<BotContext> {
    if (event.type != 'message') return;

    const ctx: TelegramMessage = event.ctx;
    if (ctx.text)
      return {
        payload: {
          type: 'message',
          message: ctx.text,
        },
      };
  }
}
