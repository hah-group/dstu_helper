import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter } from 'events';
import { BotContext } from './type/bot-context.type';
import { BotHandler } from './decorator/bot-handler.type';
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
      const result = handler.checkers.every((checker) => checker.check(ctx.payload, ctx));
      if (result) {
        ctx.from.user = await this.getUser(ctx);
        const context = this.buildContext(ctx);
        try {
          await handler.callback(context);
        } catch (e) {
          console.error(e);
          await context.send(Text.Build('unexpected-error'));
        }
        break;
      }
    }
  }

  public async getUser(ctx: BotContext): Promise<UserEntity> {
    let user = await this.userRepository.findOne(
      {
        provider: ctx.provider,
        externalId: ctx.from.id,
      },
      { populate: ['group'] },
    );

    if (!user) {
      if (ctx.provider == 'vk') {
        const transport = <ProviderTransport>this.transports.get(ctx.provider);
        if (!transport.getUser) throw new Error('Unable to get user. Method not implemented');
        user = await transport.getUser(ctx);
      } else {
        user = new UserEntity({
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
      this.log.log(`Add user (id: ${user?.id}) to group (id: ${user?.group?.id})`);
    }

    if (addedConversation || addedGroup) await this.userRepository.save(<UserEntity>user);

    return <UserEntity>user;
  }

  public buildContext(ctx: Omit<BotContext, 'universityName'>): BotHandlerContext {
    const fullCtx: BotContext = {
      ...ctx,
      universityName: 'DSTU', // TODO Add University abstraction
    };

    return {
      ...fullCtx,
      send: (message, keyboard, options) => this.send(fullCtx, { message, keyboard, options }),
      edit: (message, keyboard) => this.edit(fullCtx, { message, keyboard }),
      alert: (message) => this.alert(fullCtx, { message }),
      flush: () => this.flush(fullCtx),
    };
  }

  public send(ctx: BotContext, action: Omit<BotMessageAction, 'type'>): Promise<number> {
    const transport = <ProviderTransport>this.transports.get(ctx.provider);
    return transport.send({
      context: ctx,
      action: {
        type: 'message',
        ...action,
      },
    });
  }

  public edit(ctx: BotContext, action: Omit<BotEditAction, 'type'>): Promise<void> {
    const transport = <ProviderTransport>this.transports.get(ctx.provider);
    return transport.edit({
      context: ctx,
      action: {
        type: 'edit',
        ...action,
      },
    });
  }

  public alert(ctx: BotContext, action: Omit<BotAlertAction, 'type'>): Promise<void> {
    const transport = <ProviderTransport>this.transports.get(ctx.provider);
    return transport.alert({
      context: ctx,
      action: {
        type: 'alert',
        ...action,
      },
    });
  }

  public flush(ctx: BotContext): Promise<void> {
    const transport = <ProviderTransport>this.transports.get(ctx.provider);
    return transport.flush({
      context: ctx,
      action: null,
    });
  }
}
