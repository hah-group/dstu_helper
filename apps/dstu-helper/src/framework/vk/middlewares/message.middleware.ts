import { BaseMiddleware, BotContext, BotPayloadType } from '@dstu_helper/common';
import { DeepPartial } from 'ts-essentials';

export class MessageMiddleware extends BaseMiddleware<VkBotContext> {
  public middleware(ctx: any): DeepPartial<BotContext> | undefined {
    if (ctx.message.type == 'message_new' && !ctx.message.action)
      return {
        payload: {
          type: BotPayloadType.MESSAGE,
          text: ctx.message.text,
          messageId: ctx.message.id,
        },
      };
  }
}
