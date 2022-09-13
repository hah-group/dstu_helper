import { BaseMiddleware } from '../../bot/base.middleware';
import { DeepPartial } from 'ts-essentials';
import { BotContext } from '../../bot/type/bot-context.type';

export class BotIdMiddleware extends BaseMiddleware<VkBotContext> {
  public middleware(): DeepPartial<BotContext> {
    return {
      botId: parseInt(process.env.VK_BOT_ID),
    };
  }
}
