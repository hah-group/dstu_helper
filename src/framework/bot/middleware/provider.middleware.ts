import { BaseMiddleware } from '../base.middleware';
import { DeepPartial } from 'ts-essentials';
import { BotContext } from '../type/bot-context.type';

export class ProviderMiddleware extends BaseMiddleware {
  constructor(private readonly provider: string) {
    super();
  }

  public middleware(): DeepPartial<BotContext> {
    return {
      provider: this.provider,
    };
  }
}
