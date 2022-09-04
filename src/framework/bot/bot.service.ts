import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';
import { BotContext } from './type/bot-context.type';
import { BotHandler } from './decorator/bot-handler.type';
import { BotHandlerContext } from './type/bot-message.type';
import { BotAction, BotAlertAction, BotMessageAction } from './type/bot-action.type';

export declare interface BotService {
  emit(event: 'event', ctx: BotContext): boolean;

  emit(event: 'send', ctx: BotAction<BotMessageAction>): boolean;
  emit(event: 'edit', ctx: BotAction<BotMessageAction>): boolean;
  emit(event: 'alert', ctx: BotAction<BotAlertAction>): boolean;

  on(event: 'event', listener: (ctx: BotContext) => void): this;

  on(event: 'send', listener: (ctx: BotAction<BotMessageAction>) => void): boolean;
  on(event: 'edit', listener: (ctx: BotAction<BotMessageAction>) => void): boolean;
  on(event: 'alert', listener: (ctx: BotAction<BotMessageAction>) => void): boolean;
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
        handler.callback(this.buildContext(ctx)).then();
        break;
      }
    }
  }

  public buildContext(ctx: BotContext): BotHandlerContext {
    return {
      ...ctx,
      send: (message, keyboard, options) => this.send(ctx, { message, keyboard, options }),
      edit: (message, keyboard, options) => this.edit(ctx, { message, keyboard, options }),
      alert: (message) => this.alert(ctx, { message }),
    };
  }

  public send(ctx: BotContext, action: Omit<BotMessageAction, 'type'>): Promise<void> {
    return new Promise((resolve) => {
      this.emit('send', {
        context: ctx,
        action: {
          type: 'message',
          ...action,
        },
      });
      resolve();
    });
  }

  public edit(ctx: BotContext, action: Omit<BotMessageAction, 'type'>): Promise<void> {
    return new Promise((resolve) => {
      this.emit('edit', {
        context: ctx,
        action: {
          type: 'message',
          ...action,
        },
      });
      resolve();
    });
  }

  public alert(ctx: BotContext, action: Omit<BotAlertAction, 'type'>): Promise<void> {
    return new Promise((resolve) => {
      this.emit('alert', {
        context: ctx,
        action: {
          type: 'alert',
          ...action,
        },
      });
      resolve();
    });
  }
}
