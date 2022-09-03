import { BaseMiddleware } from '../../bot/base.middleware';
import { DeepPartial } from 'ts-essentials';
import { BotContext, ChatUser } from '../../bot/type/bot-context.type';

export class ChatEventMiddleware extends BaseMiddleware<VkBotContext> {
  public middleware(ctx: VkBotContext): DeepPartial<BotContext> {
    if (
      ctx.message.action &&
      (ctx.message.action.type == 'chat_invite_user' ||
        ctx.message.action.type == 'chat_kick_user' ||
        ctx.message.action.type == 'chat_invite_user_by_link')
    ) {
      const members: ChatUser[] = [{ id: parseInt(`${ctx.message.action.member_id}`) }];

      return {
        payload: {
          type: 'chat_event',
          eventType: ctx.message.action.type == 'chat_kick_user' ? 'kick' : 'invite',
          members: members,
        },
      };
    }
  }
}
