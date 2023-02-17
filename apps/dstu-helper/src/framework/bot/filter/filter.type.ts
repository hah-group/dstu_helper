import { BotContext } from '../type/bot-context.type';

export abstract class Filter<T> {
  protected constructor(protected metadata: T) {}

  public abstract check(context: BotContext): boolean;
}
