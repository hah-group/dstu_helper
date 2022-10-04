import { BaseMiddleware } from '../../bot/base.middleware';
import { DeepPartial } from 'ts-essentials';
import { BotContext, ChatUser } from '../../bot/type/bot-context.type';
import { BotPayloadType } from '../../bot/type/bot-payload-type.enum';

export class ChatEventMiddleware extends BaseMiddleware<VkBotContext> {
  public middleware(ctx: VkBotContext): DeepPartial<BotContext> | undefined {
    if (
      ctx.message.action &&
      (ctx.message.action.type == 'chat_invite_user' ||
        ctx.message.action.type == 'chat_kick_user' ||
        ctx.message.action.type == 'chat_invite_user_by_link')
    ) {
      const members: Omit<ChatUser, 'user'>[] = [{ id: parseInt(`${ctx.message.action.member_id}`) }];

      return {
        payload: {
          type: BotPayloadType.CHAT_EVENT,
          eventType: ctx.message.action.type == 'chat_kick_user' ? 'kick' : 'invite',
          members: members,
        },
      };
    }
  }
}
