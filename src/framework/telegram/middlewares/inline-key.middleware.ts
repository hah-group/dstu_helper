import { BaseMiddleware } from '../../bot/base.middleware';
import { DeepPartial } from 'ts-essentials';
import { BotContext } from '../../bot/type/bot-context.type';
import { TelegramContext } from '../telegram.service';
import { BotPayloadType } from '../../bot/type/bot-payload-type.enum';

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
