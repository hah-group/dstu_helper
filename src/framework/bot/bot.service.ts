import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';
import { BotContext } from './type/bot-context.type';
import { BotHandler } from './decorator/bot-handler.type';
import { BotHandlerContext } from './type/bot-message.type';
import { BotAction, BotAlertAction, BotMessageAction } from './type/bot-action.type';
import { UserRepository } from '../../modules/user/user.repository';
import { UserEntity } from '../../modules/user/user.entity';
import { UseRequestContext } from '@mikro-orm/core';

export declare interface BotService {
  emit(event: 'event', ctx: BotContext): boolean;

  emit(event: 'send', ctx: BotAction<BotMessageAction>): boolean;
  emit(event: 'edit', ctx: BotAction<BotMessageAction>): boolean;
  emit(event: 'alert', ctx: BotAction<BotAlertAction>): boolean;

  emit(event: 'getUserRequest', ctx: BotContext): boolean;
  emit(event: 'getUserResponse', ctx: UserEntity): boolean;

  on(event: 'event', listener: (ctx: BotContext) => void): this;

  on(event: 'send', listener: (ctx: BotAction<BotMessageAction>) => void): boolean;
  on(event: 'edit', listener: (ctx: BotAction<BotMessageAction>) => void): boolean;
  on(event: 'alert', listener: (ctx: BotAction<BotMessageAction>) => void): boolean;

  on(event: 'getUserRequest', listener: (ctx: BotContext) => void): boolean;
  on(event: 'getUserResponse', listener: (ctx: UserEntity) => void): boolean;
}

@Injectable()
export class BotService extends EventEmitter {
  constructor(private readonly userRepository: UserRepository) {
    super();

    this.on('event', async (ctx) => this.onEvent(ctx));
  }

  private handlers: Set<BotHandler> = new Set<BotHandler>();

  public registerHandler(handler: BotHandler): void {
    this.handlers.add(handler);
  }

  public async onEvent(ctx: BotContext): Promise<void> {
    for (const handler of this.handlers.values()) {
      const result = handler.checkers.every((checker) => checker.check(ctx.payload, ctx));
      if (result) {
        const newCtx = await this.injectUser(ctx);
        await handler.callback(this.buildContext(newCtx));
        break;
      }
    }
  }

  public async injectUser(ctx: BotContext): Promise<BotContext> {
    let user = await this.userRepository.findOne({
      provider: ctx.provider,
      externalId: ctx.from.id,
    });

    if (!user) {
      if (ctx.provider == 'vk') {
        user = await new Promise((resolve) => {
          this.emit('getUserRequest', ctx);

          const callback = (user) => {
            resolve(user);
            this.removeListener('getUserResponse', callback);
          };
          this.on('getUserResponse', callback);
        });
      } else {
        user = new UserEntity({
          provider: ctx.provider,
          externalId: ctx.from.id,
          firstName: ctx.from.firstName,
          lastName: ctx.from.lastName,
          nickname: ctx.from.nickname,
        });
      }

      await this.userRepository.save(user);
    }

    ctx.from.user = user;
    return ctx;
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
