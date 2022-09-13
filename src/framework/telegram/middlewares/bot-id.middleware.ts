import { BaseMiddleware } from '../../bot/base.middleware';
import { DeepPartial } from 'ts-essentials';
import { BotContext } from '../../bot/type/bot-context.type';
import { TelegramContext } from '../telegram-new.service';

export class BotIdMiddleware extends BaseMiddleware<TelegramContext> {
  public middleware(): DeepPartial<BotContext> {
    const match = process.env.TG_BOT_TOKEN.match(/^(\d+):/);
    return {
      botId: match && parseInt(match[1]),
    };
  }
}
