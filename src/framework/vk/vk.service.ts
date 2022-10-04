import { Inject, Injectable, Logger } from '@nestjs/common';
import { VK_OPTIONS } from './constants';
import { VK } from 'vk-io';
import { VkModuleOptions } from './vk-module.options';
import VkBot from 'node-vk-bot-api';
import { ChatMiddleware } from './middlewares/chat.middleware';
import { MessageMiddleware } from './middlewares/message.middleware';
import { MiddlewareExecutor } from '../bot/middleware/middleware.executor';
import { BaseMiddleware } from '../bot/base.middleware';
import { ProviderMiddleware } from '../bot/middleware/provider.middleware';
import { UserMiddleware } from './middlewares/user.middleware';
import { ChatEventMiddleware } from './middlewares/chat-event.middleware';
import { BotContext, BotExtendedContext } from '../bot/type/bot-context.type';
import { InlineKeyMiddleware } from './middlewares/inline-key.middleware';
import { BotService } from '../bot/bot.service';
import { BotIdMiddleware } from './middlewares/bot-id.middleware';
import { UserEntity } from '../../modules/user/user.entity';
import { VkProducer } from './job/vk.producer';
import { BotAction, BotAlertAction, BotEditAction, BotMessageAction } from '../bot/type/bot-action.type';
import { BotPayloadType } from '../bot/type/bot-payload-type.enum';
import { VkKeyboardBuilder } from './vk-keyboard.builder';
import { inspect } from 'util';

export interface VkContextMetadata {
  lastMessageId?: number;
  eventId?: string;
}

@Injectable()
export class VkService {
  public readonly bot: VkBot;
  private readonly log = new Logger('VK');
  private readonly vkApi: VK;

  private readonly middlewares: BaseMiddleware[];
  private readonly providerName = 'vk';

  constructor(
    @Inject(VK_OPTIONS) options: VkModuleOptions,
    private readonly botService: BotService,
    private readonly vkProducer: VkProducer,
  ) {
    this.vkApi = new VK({
      token: options.token,
      apiVersion: '5.144',
    });

    this.bot = new VkBot({
      token: options.token,
      group_id: options.groupId,
    });

    this.bot.use(async (ctx) => {
      try {
        await this.onEvent(ctx);
      } catch (e) {
        if (!(e instanceof Error)) return;
        this.log.error(`Global event handler throw error`);
        this.log.error(e.stack);
      }
    });

    this.bot.startPolling((err) => {
      console.log(err);
      return {};
    });

    this.middlewares = [
      new ProviderMiddleware(this.providerName),
      new UserMiddleware(),
      new ChatMiddleware(),
      new ChatEventMiddleware(),
      new MessageMiddleware(),
      new InlineKeyMiddleware(),
      new BotIdMiddleware(),
    ];

    this.botService.registerProvider(this.providerName, {
      send: (ctx) => this.onSend(ctx),
      edit: (ctx) => this.onEdit(ctx),
      alert: (ctx) => this.onAlert(ctx),
      flush: () => Promise.resolve(),
      getUser: (ctx) => this.onGetUser(ctx),
    });

    //this.botService.on('get-user-request', (ctx) => this.getUser(ctx));
  }

  public onEvent(ctx: VkBotContext): void {
    const newCtx: BotExtendedContext<VkContextMetadata> = MiddlewareExecutor.Execute(ctx, this.middlewares);
    newCtx.metadata = {
      eventId: (<any>ctx.message).event_id,
    };

    this.botService.emit('event', newCtx);
  }

  public async getUser(userId: number): Promise<UserEntity> {
    let response: any;
    try {
      response = await this.bot.execute('users.get', {
        user_ids: [`${userId}`],
        fields: 'screen_name',
      });
      response = response[0];
    } catch (e) {
      console.error(e);
    }

    return new UserEntity({
      provider: 'vk',
      externalId: userId,
      firstName: response?.first_name,
      lastName: response?.last_name,
      nickname: response?.screen_name,
    });
  }

  public async sendMessage(chatId: number, message: string, keyboard?: any): Promise<number> {
    try {
      const response = await this.bot.sendMessage(chatId, message, undefined, <VkBotKeyboard>{
        toJSON: () => JSON.stringify(keyboard),
      });
      return response.message_id || response.conversation_message_id;
    } catch (e) {
      console.log(e);
      return -1;
    }
  }

  public async editMessage(chatId: number, messageId: number, message: string, keyboard?: any): Promise<void> {
    try {
      await this.bot.execute('messages.edit', {
        peer_id: chatId,
        conversation_message_id: messageId,
        keyboard: keyboard ? JSON.stringify(keyboard) : undefined,
        message: message,
      });
    } catch (e) {
      console.log(e);
      await this.sendMessage(chatId, message, keyboard);
    }
  }

  public async sendAlert(chatId: number, fromId: number, eventId: string, text: string): Promise<void> {
    await this.bot.execute('messages.sendMessageEventAnswer', {
      peer_id: chatId,
      user_id: fromId,
      event_id: eventId,
      event_data: {
        text: text,
      },
    });
  }

  private async onGetUser(ctx: BotContext): Promise<UserEntity> {
    const job = await this.vkProducer.getUser({
      userId: ctx.from.id,
    });

    const result: UserEntity = await job.finished();

    return new UserEntity({
      provider: 'vk',
      externalId: result.externalId,
      firstName: result.firstName,
      lastName: result.lastName,
      nickname: result.nickname,
    });
  }

  private async onSend(ctx: BotAction<BotMessageAction, VkContextMetadata>): Promise<number> {
    const message = ctx.action.message.render();
    const keyboard = ctx.action.keyboard && VkKeyboardBuilder.Build(ctx.action.keyboard);

    let chatId = ctx.context.chat.id;
    if (ctx.action.options?.forcePrivate) chatId = ctx.context.from.id;

    const job = await this.vkProducer.send({
      chatId: chatId,
      message: message,
      keyboard: keyboard,
    });

    const messageId = await job.finished();
    ctx.context.metadata = {
      ...ctx.context.metadata,
      lastMessageId: messageId,
    };

    return messageId;
  }

  private async onEdit(ctx: BotAction<BotEditAction, VkContextMetadata>): Promise<void> {
    if (!ctx.context.metadata?.eventId) return;
    if (ctx.context.payload.type != BotPayloadType.MESSAGE && ctx.context.payload.type != BotPayloadType.INLINE_KEY)
      return;

    const keyboardBuilder = ctx.action.keyboard?.inline();
    let keyboard;
    if (keyboardBuilder) keyboard = VkKeyboardBuilder.Build(keyboardBuilder);

    let message;
    if (ctx.action.message) message = ctx.action.message.render();

    if (message) {
      await this.vkProducer.edit({
        chatId: ctx.context.chat.id,
        messageId: ctx.context.payload.messageId,
        text: message,
        keyboard: keyboard,
      });
    }
  }

  private async onAlert(ctx: BotAction<BotAlertAction, VkContextMetadata>): Promise<void> {
    if (!ctx.context.metadata?.eventId) return;

    await this.vkProducer.alert({
      eventId: ctx.context.metadata.eventId,
      chatId: ctx.context.chat.id,
      fromId: ctx.context.from.id,
      text: ctx.action.message.render(),
    });
  }
}
