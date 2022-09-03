import { BaseMiddleware } from '../../bot/base.middleware';
import { DeepPartial } from 'ts-essentials';
import { BotContext } from '../../bot/type/bot-context.type';

const CONVERSATION_START_ID = 2000000000;

export class ChatMiddleware extends BaseMiddleware<VkBotContext> {
  public middleware(ctx: VkBotContext): DeepPartial<BotContext> {
    return {
      chat: {
        id: ctx.message.peer_id,
        scope: ctx.message.peer_id >= CONVERSATION_START_ID ? 'conversation' : 'private',
      },
    };
  }
}
