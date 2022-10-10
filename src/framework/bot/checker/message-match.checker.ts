import { Checker } from './checker.type';
import { BotPayloadType } from '../type/bot-payload-type.enum';
import { BotContext, BotMessagePayload } from '../type/bot-context.type';
import { OnMessageEventItem } from '../decorator/on-message.decorator';
import { HandlerMetadata } from '../decorator/bot-handler.type';

export class MessageMatchChecker extends Checker<BotMessagePayload> {
  constructor(metadata: HandlerMetadata) {
    super(metadata);
  }

  public check(payload: BotMessagePayload, context: Omit<BotContext, 'payload'>): boolean {
    if (this.metadata.type != BotPayloadType.MESSAGE) return true;

    let targets: OnMessageEventItem[] = [];
    if (!Array.isArray(this.metadata.event)) targets = [this.metadata.event];
    else targets = this.metadata.event;

    for (const target of targets) {
      if (typeof target == 'function') {
        if (target(payload.text)) return true;
      } else {
        let checkingValue: RegExp | undefined;
        if (typeof target == 'string') checkingValue = new RegExp(target, 'gi');
        else if (target instanceof RegExp) checkingValue = target;

        const result = checkingValue && !!payload.text.match(checkingValue);
        if (result) return true;
      }
    }

    return false;
  }
}
