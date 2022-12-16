import { BotContext } from './type/bot-context.type';
import { DeepPartial } from 'ts-essentials';

export abstract class BaseMiddleware<T = any> {
  public abstract middleware(ctx: T): DeepPartial<BotContext> | undefined;
}
