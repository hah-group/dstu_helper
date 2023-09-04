import { DeepPartial } from 'ts-essentials';

import { BotContext } from '../type';

export abstract class BaseMiddleware<T = any> {
  public abstract middleware(ctx: T): DeepPartial<BotContext> | undefined;
}
