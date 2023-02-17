import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter } from 'events';
import { BotContext, BotExtendedContext } from './type/bot-context.type';
import { BotHandler } from './decorator/type/bot-handler.type';
import { BotHandlerContext } from './type/bot-message.type';
import { BotAction, BotAlertAction, BotBroadcastAction, BotEditAction, BotMessageAction } from './type/bot-action.type';
import { UserRepository } from '../../modules/user/user.repository';
import { UserEntity } from '../../modules/user/user.entity';
import { ConversationRepository } from '../../modules/conversation/conversation.repository';
import { Text } from '../text/text';
import { EventEmitter2 } from '@nestjs/event-emitter';

export interface BotBroadcastEvent {
  provider: string;
  targetIds: number[];
  message: Text;
}

export declare interface BotService {
  emit(event: 'event', ctx: BotContext): boolean;

  on(event: 'event', listener: (ctx: BotContext) => void): this;
}

export interface ProviderTransport {
  send: (data: BotAction<BotMessageAction>) => Promise<number>;
  edit: (data: BotAction<BotEditAction>) => Promise<void>;
  alert: (data: BotAction<BotAlertAction>) => Promise<void>;
  flush: (data: BotAction<null>) => Promise<void>;

  getUser?: (ctx: BotContext) => Promise<UserEntity>;
  broadcast: (data: BotBroadcastAction) => Promise<void>;
}

@Injectable()
export class BotService extends EventEmitter {
  private readonly log = new Logger('BotService');
  private handlers: Set<BotHandler> = new Set<BotHandler>();
  private transports: Map<string, ProviderTransport> = new Map<string, ProviderTransport>();

  constructor(
    private readonly userRepository: UserRepository,
    private readonly conversationRepository: ConversationRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super();

    this.on('event', async (ctx) => this.onEvent(ctx));
    this.eventEmitter.on('broadcast', (data: BotBroadcastEvent) => this.onBroadcast(data));
  }

  public registerHandler(handler: BotHandler): void {
    this.handlers.add(handler);

    const array = Array.from(this.handlers.values());
    const hasEventHandlers = array.filter((handler) => handler.hasEvent);
    const emptyEventHandlers = array.filter((handler) => !handler.hasEvent);

    this.handlers = new Set([...hasEventHandlers, ...emptyEventHandlers]);
  }

  public registerProvider(provider: string, transport: ProviderTransport): void {
    this.transports.set(provider, transport);
  }

  public async onBroadcast(data: BotBroadcastEvent): Promise<void> {
    const transport = this.transports.get(data.provider);
    if (!transport) return;

    await transport.broadcast({
      type: 'broadcast',
      targetIds: data.targetIds,
      message: data.message,
    });
  }

  public async onEvent(ctx: BotContext): Promise<void> {
    if (!ctx.payload || !ctx.payload.type) return;
    for (const handler of this.handlers.values()) {
      const isCorrect = handler.check(ctx.payload, ctx);
      if (isCorrect) {
        ctx.from.user = await this.getUser(ctx);
        const context = this.buildContext(ctx);

        const isExecute = handler.filter(ctx);
        if (isExecute) {
          try {
            await handler.callback(context);
          } catch (e) {
            console.error(e);
            await context.send(Text.Build('unexpected-error'));
          }
          if (!handler.allowNext) break;
        }
      }
    }
  }

  public async getUser(ctx: BotContext): Promise<UserEntity> {
    let user = await this.userRepository.findOne({
      provider: ctx.provider,
      externalId: ctx.from.id,
    });

    if (!user) {
      if (ctx.provider == 'vk') {
        const transport = <ProviderTransport>this.transports.get(ctx.provider);
        if (!transport.getUser) throw new Error('Unable to get user. Method not implemented');
        user = await transport.getUser(ctx);
      } else {
        user = UserEntity.Create({
          provider: ctx.provider,
          externalId: ctx.from.id,
          firstName: ctx.from.firstName,
          lastName: ctx.from.lastName,
          nickname: ctx.from.nickname,
        });
      }
      await this.userRepository.save(<UserEntity>user);
    }

    //TODO Fix crutch
    const conversation = await this.conversationRepository.getById(ctx.chat.id, ctx.provider);
    const addedConversation = await (<UserEntity>user).checkConversation(conversation || undefined);
    if (addedConversation) {
      this.log.log(`Add user (id: ${user?.id}) to conversation (id: ${conversation?.id})`);
    }

    const addedGroup = await (<UserEntity>user).checkGroup(conversation || undefined);
    if (addedGroup) {
      this.log.log(`Add user (id: ${user?.id}) to group (id: ${addedGroup})`);
    }

    if (addedConversation || addedGroup) await this.userRepository.save(<UserEntity>user);

    return <UserEntity>user;
  }

  public buildContext(ctx: BotExtendedContext): BotHandlerContext {
    return {
      ...ctx,
      send: (message, keyboard, options) => this.send(ctx, { message, keyboard, options }),
      edit: (message, keyboard) => this.edit(ctx, { message, keyboard }),
      alert: (message) => this.alert(ctx, { message }),
      flush: () => this.flush(ctx),
    };
  }

  public async send(ctx: BotExtendedContext, action: Omit<BotMessageAction, 'type'>): Promise<number> {
    const transport = <ProviderTransport>this.transports.get(ctx.provider);
    const beforeSend = Date.now();
    const result = await transport.send({
      context: ctx,
      action: {
        type: 'message',
        ...action,
      },
    });

    //console.log(ctx.from.user.properties.inputStage.get());
    this.printResponseTime(ctx, beforeSend);
    return result;
  }

  public async edit(ctx: BotExtendedContext, action: Omit<BotEditAction, 'type'>): Promise<void> {
    const transport = <ProviderTransport>this.transports.get(ctx.provider);
    const beforeSend = Date.now();
    const result = await transport.edit({
      context: ctx,
      action: {
        type: 'edit',
        ...action,
      },
    });

    this.printResponseTime(ctx, beforeSend);
    return result;
  }

  public async alert(ctx: BotExtendedContext, action: Omit<BotAlertAction, 'type'>): Promise<void> {
    const transport = <ProviderTransport>this.transports.get(ctx.provider);
    const beforeSend = Date.now();
    const result = await transport.alert({
      context: ctx,
      action: {
        type: 'alert',
        ...action,
      },
    });

    this.printResponseTime(ctx, beforeSend);
    return result;
  }

  public async flush(ctx: BotExtendedContext): Promise<void> {
    const transport = <ProviderTransport>this.transports.get(ctx.provider);
    const beforeSend = Date.now();
    const result = await transport.flush({
      context: ctx,
      action: null,
    });

    this.printResponseTime(ctx, beforeSend);
    return result;
  }

  private printResponseTime(ctx: BotExtendedContext, beforeSend: number): void {
    if (ctx.coreMetadata?.requestTime) {
      this.log.log(
        `Response completed: ${Date.now() - ctx.coreMetadata?.requestTime} ms (${Date.now() - beforeSend} ms)`,
      );
      ctx.coreMetadata.requestTime = Date.now();
    }
  }
}
