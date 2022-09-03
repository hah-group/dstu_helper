import { BaseMiddleware } from '../../bot/base.middleware';
import { DeepPartial } from 'ts-essentials';
import { BotContext } from '../../bot/type/bot-context.type';
import { BotPayloadType } from '../../bot/type/bot-payload-type.enum';

export class MessageMiddleware extends BaseMiddleware<VkBotContext> {
  public middleware(ctx: any): DeepPartial<BotContext> {
    if (ctx.message.type == 'message_new' && !ctx.message.action)
      return {
        payload: {
          type: BotPayloadType.MESSAGE,
          message: ctx.message.text,
        },
      };
  }
}
