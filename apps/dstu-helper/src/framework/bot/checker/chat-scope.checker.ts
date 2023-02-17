import { Checker } from './checker.type';
import { BotPayloadType } from '../type/bot-payload-type.enum';
import { BotContext, BotContextPayload } from '../type/bot-context.type';
import { HandlerMetadata } from '../decorator/type/bot-handler.type';

export class ChatScopeChecker extends Checker {
  constructor(metadata: HandlerMetadata) {
    super(metadata);
  }

  public check(payload: BotContextPayload, context: Omit<BotContext, 'payload'>): boolean {
    if (this.metadata.type != BotPayloadType.MESSAGE) return true;

    return this.metadata.scope == context.chat.scope || !this.metadata.scope;
  }
}
