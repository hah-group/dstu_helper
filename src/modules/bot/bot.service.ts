import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';
import { BotContext } from './type/bot-context.type';
import { inspect } from 'util';

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

  public onEvent(ctx: BotContext): void {
    console.log(inspect(ctx, false, 10, true));
  }
}
