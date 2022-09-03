import { BaseMiddleware } from '../../bot/base.middleware';
import { DeepPartial } from 'ts-essentials';
import { BotContext } from '../../bot/type/bot-context.type';

export class MessageMiddleware extends BaseMiddleware<VkBotContext> {
  public middleware(ctx: any): DeepPartial<BotContext> {
    if (ctx.message.type == 'message_new' && !ctx.message.action)
      return {
        payload: {
          type: 'message',
          message: ctx.message.text,
        },
      };
  }
}
