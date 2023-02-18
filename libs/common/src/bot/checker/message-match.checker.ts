import { BotContext, BotMessagePayload, BotPayloadType, OnMessageEventItem } from '@dstu_helper/common';

import { HandlerMetadata } from '../decorator/type/bot-handler.type';
import { Checker } from './checker.type';

export class MessageMatchChecker extends Checker<BotMessagePayload> {
  constructor(metadata: HandlerMetadata) {
    super(metadata);
  }

  public static Match(targets: (OnMessageEventItem | undefined)[], input: string): boolean {
    for (const target of targets) {
      if (typeof target == 'undefined') return true;
      if (typeof target == 'function') {
        if (target(input)) return true;
      } else {
        let checkingValue: RegExp | undefined;
        if (typeof target == 'string') checkingValue = new RegExp(target, 'gi');
        else if (target instanceof RegExp) checkingValue = target;

        const result = checkingValue && !!input.match(checkingValue);
        if (result) return true;
      }
    }

    return false;
  }

  public check(payload: BotMessagePayload, context: Omit<BotContext, 'payload'>): boolean {
    if (this.metadata.type != BotPayloadType.MESSAGE) return true;

    let targets: (OnMessageEventItem | undefined)[] = [];
    if (!Array.isArray(this.metadata.event)) targets = [this.metadata.event];
    else targets = this.metadata.event;

    return MessageMatchChecker.Match(targets, payload.text);
  }
}
