import { BaseMiddleware } from '../../bot/base.middleware';
import { DeepPartial } from 'ts-essentials';
import { BotContext } from '../../bot/type/bot-context.type';
import { TelegramContext, TelegramMessage } from '../telegram.service';
import { BotPayloadType } from '../../bot/type/bot-payload-type.enum';

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
