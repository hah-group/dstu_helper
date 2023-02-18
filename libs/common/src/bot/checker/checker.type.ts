import { BotBaseContext, BotContextPayload } from '@dstu_helper/common';

import { HandlerMetadata } from '../decorator/type/bot-handler.type';

export abstract class Checker<T extends BotContextPayload = BotContextPayload> {
  protected constructor(protected metadata: HandlerMetadata) {}

  public abstract check(payload: T, context: BotBaseContext): boolean;
}
