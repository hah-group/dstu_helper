import { BaseMiddleware, BotContext } from '@dstu_helper/common';
import { DeepPartial } from 'ts-essentials';

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
