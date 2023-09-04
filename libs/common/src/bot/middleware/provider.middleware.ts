import { DeepPartial } from 'ts-essentials';

import { BotContext } from '../type';
import { BaseMiddleware } from './base.middleware';

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
