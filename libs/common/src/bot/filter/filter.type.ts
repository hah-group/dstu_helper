import { BotContext } from '@dstu_helper/common';

export abstract class Filter<T> {
  protected constructor(protected metadata: T) {}

  public abstract check(context: BotContext): boolean;
}
