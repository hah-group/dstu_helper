import { BotContext, BotContextPayload } from '../type/bot-context.type';
import { HandlerMetadata } from '../decorator/bot-handler.type';

/*export type Checker<T extends BotContextPayload = BotContextPayload> = (
  handlerMetadata: HandlerMetadata,
) => (payload: T, context: Omit<BotContext, 'payload'>) => boolean;*/

export abstract class Checker<T extends BotContextPayload = BotContextPayload> {
  protected constructor(protected metadata: HandlerMetadata) {}

  public abstract check(payload: T, context: Omit<BotContext, 'payload'>): boolean;
}
