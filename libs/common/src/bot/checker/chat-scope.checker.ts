import { BotContext, BotContextPayload, BotPayloadType } from '@dstu_helper/common';

import { HandlerMetadata } from '../decorator/type/bot-handler.type';
import { Checker } from './checker.type';

export class ChatScopeChecker extends Checker {
  constructor(metadata: HandlerMetadata) {
    super(metadata);
  }

  public check(payload: BotContextPayload, context: Omit<BotContext, 'payload'>): boolean {
    if (this.metadata.type != BotPayloadType.MESSAGE) return true;

    return this.metadata.scope == context.chat.scope || !this.metadata.scope;
  }
}
