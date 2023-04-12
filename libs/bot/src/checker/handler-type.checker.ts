import { HandlerMetadata } from '../decorator/type/bot-handler.type';
import { BotContext, BotContextPayload, BotMessagePayload } from '../type/bot-context.type';
import { Checker } from './checker.type';

export class HandlerTypeChecker extends Checker<BotMessagePayload> {
  constructor(metadata: HandlerMetadata) {
    super(metadata);
  }

  public check(payload: BotContextPayload, context: Omit<BotContext, 'payload'>): boolean {
    return this.metadata.type == payload.type;
  }
}
