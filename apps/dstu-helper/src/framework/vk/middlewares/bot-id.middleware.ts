import { BaseMiddleware, BotContext } from '@dstu_helper/common';
import { DeepPartial } from 'ts-essentials';

export class BotIdMiddleware extends BaseMiddleware<VkBotContext> {
  public middleware(): DeepPartial<BotContext> {
    return {
      botId: -parseInt(process.env.VK_BOT_ID || '0'),
    };
  }
}
