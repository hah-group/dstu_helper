import { BaseMiddleware, BotContext, BotPayloadType } from '@dstu_helper/common';
import { DeepPartial } from 'ts-essentials';

import { TelegramContext } from '../telegram.service';

export class InlineKeyMiddleware extends BaseMiddleware<TelegramContext> {
  public middleware(event: TelegramContext): DeepPartial<BotContext> | undefined {
    if (event.type != 'callback_query') return;

    return {
      payload: {
        type: BotPayloadType.INLINE_KEY,
        key: event.ctx.data,
        messageId: event.ctx.message?.message_id || -1,
      },
    };
  }
}
