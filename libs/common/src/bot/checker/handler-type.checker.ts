import { BotContext, BotContextPayload, BotMessagePayload } from '@dstu_helper/common';

import { HandlerMetadata } from '../decorator/type/bot-handler.type';
import { Checker } from './checker.type';

export class HandlerTypeChecker extends Checker<BotMessagePayload> {
  constructor(metadata: HandlerMetadata) {
    super(metadata);
  }

  public check(payload: BotContextPayload, context: Omit<BotContext, 'payload'>): boolean {
    return this.metadata.type == payload.type;
  }
}
