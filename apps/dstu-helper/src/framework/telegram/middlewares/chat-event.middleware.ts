import { BaseMiddleware } from '../../bot/base.middleware';
import { DeepPartial } from 'ts-essentials';
import { BotContext, ChatUser } from '../../bot/type/bot-context.type';
import { UserMiddleware } from './user.middleware';
import { TelegramContext, TelegramMessage } from '../telegram.service';
import { BotPayloadType } from '../../bot/type/bot-payload-type.enum';

export class ChatEventMiddleware extends BaseMiddleware<TelegramContext> {
  public middleware(event: TelegramContext): DeepPartial<BotContext> | undefined {
    if (event.type != 'message') return;

    const ctx: TelegramMessage = event.ctx;

    if (ctx.new_chat_members || ctx.left_chat_member) {
      let members: Omit<ChatUser, 'user'>[] = [];
      if (ctx.new_chat_members) {
        members = ctx.new_chat_members.map((member) => UserMiddleware.Parse(member));
      } else {
        const leftChatMember = ctx.left_chat_member;
        if (leftChatMember) members = [UserMiddleware.Parse(leftChatMember)];
      }

      return {
        payload: {
          type: BotPayloadType.CHAT_EVENT,
          eventType: ctx.new_chat_members ? 'invite' : 'kick',
          members: members,
        },
      };
    }
  }
}
