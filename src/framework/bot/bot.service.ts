import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';
import { BotContext } from './type/bot-context.type';
import { inspect } from 'util';
import { BotHandler } from './decorator/bot-handler.type';

export declare interface BotService {
  emit(event: 'event', ctx: BotContext): boolean;

  on(event: 'event', listener: (ctx: BotContext) => void): this;
}

@Injectable()
export class BotService extends EventEmitter {
  constructor() {
    super();

    this.on('event', this.onEvent.bind(this));
  }

  private handlers: Set<BotHandler> = new Set<BotHandler>();

  public registerHandler(handler: BotHandler): void {
    this.handlers.add(handler);
  }

  public onEvent(ctx: BotContext): void {
    for (const handler of this.handlers.values()) {
      const result = handler.checkers.every((checker) => checker.check(ctx.payload, ctx));
      if (result) {
        console.log(handler);
        break;
      }
    }
    console.log(inspect(ctx, false, 10, true));
  }
}
