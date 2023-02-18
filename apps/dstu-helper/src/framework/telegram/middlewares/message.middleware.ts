import { BaseMiddleware, BotContext, BotPayloadType } from '@dstu_helper/common';
import { DeepPartial } from 'ts-essentials';

import { TelegramContext, TelegramMessage } from '../telegram.service';

export class MessageMiddleware extends BaseMiddleware<TelegramContext> {
  public middleware(event: TelegramContext): DeepPartial<BotContext> | undefined {
    if (event.type != 'message') return;

    const ctx: TelegramMessage = event.ctx;
    if (ctx.text)
      return {
        payload: {
          type: BotPayloadType.MESSAGE,
          text: ctx.text,
          messageId: ctx.message_id,
        },
      };
  }
}
