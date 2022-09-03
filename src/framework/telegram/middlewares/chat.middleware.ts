import { BaseMiddleware } from '../../bot/base.middleware';
import { DeepPartial } from 'ts-essentials';
import { BotContext, Chat } from '../../bot/type/bot-context.type';
import { Chat as TelegramChat } from 'node-telegram-bot-api';
import { TelegramContext } from '../telegram-new.service';

export class ChatMiddleware extends BaseMiddleware<TelegramContext> {
  public static Parse(chat: TelegramChat): Chat {
    return {
      id: chat.id,
      type: chat.type == 'private' ? 'private' : 'conversation',
    };
  }

  public middleware(event: TelegramContext): DeepPartial<BotContext> {
    let chat: TelegramChat | undefined;
    if (event.type == 'message') chat = event.ctx.chat;
    else chat = event.ctx.message?.chat;

    return {
      chat: ChatMiddleware.Parse(chat),
    };
  }
}
