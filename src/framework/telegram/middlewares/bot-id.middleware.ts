import { BaseMiddleware } from '../../bot/base.middleware';
import { DeepPartial } from 'ts-essentials';
import { BotContext } from '../../bot/type/bot-context.type';
import { TelegramContext } from '../telegram.service';

export class BotIdMiddleware extends BaseMiddleware<TelegramContext> {
  public middleware(): DeepPartial<BotContext> | undefined {
    const match = (process.env.TG_BOT_TOKEN || '').match(/^(\d+):/);
    if (!match) return;
    return {
      botId: parseInt(match[1]),
    };
  }
}
