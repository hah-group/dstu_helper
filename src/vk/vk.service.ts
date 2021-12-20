import { Inject, Injectable, Logger } from '@nestjs/common';
import { VK_OPTIONS } from './constants';
import { VK } from 'vk-io';
import { VkModuleOptions } from './vk-module.options';
import VkBot from 'node-vk-bot-api';
import { Handler, OnInlineButtonMetadata, OnMessageMetadata } from '../bot/handler-metadata.type';
import { VkMessageData, VkMessageEventData, VkMessageNewData } from './vk-message-data.type';
import { VkEvent } from './vk-event.definition';
import { EventType } from '../bot/metadata-type.enum';
import { VkInlineButtonMessage, VkTextMessage } from '../bot/message.type';
import { SocialSource } from '../bot/social.enum';
import { VkProducer } from './job/vk.producer';
import { KeyboardBuilder } from '../bot/keyboard/keyboard.builder';
import * as util from 'util';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

const CONVERSATION_START_ID = 2000000000;

@Injectable()
export class VkService {
  private readonly log = new Logger('VK');

  private readonly vkApi: VK;
  private readonly bot: VkBot;
  private handlers: Set<Handler> = new Set<Handler>();

  constructor(
    @Inject(VK_OPTIONS) options: VkModuleOptions,
    private readonly vkProducer: VkProducer,
    private readonly userService: UserService,
  ) {
    this.vkApi = new VK({
      token: options.token,
    });
    this.bot = new VkBot({
      token: options.token,
      group_id: options.groupId,
    });

    this.bot.use((ctx) => {
      try {
        this.onEvent(ctx);
      } catch (e) {
        this.log.error(`Global event handler throw error`);
        this.log.error(util.inspect(e, false, null, true));
      }
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.bot.startPolling((err) => {
      this.log.error(`Polling thread throw error`);
      this.log.error(util.inspect(err, false, null, true));
    });
  }

  public addHandler(handler: Handler) {
    this.handlers.add(handler);
  }

  public async sendMessage(peerId: number, text: string, keyboard?: string): Promise<number | undefined> {
    try {
      const result: any[] = <any>await this.vkApi.api.messages.send({
        peer_ids: peerId,
        random_id: new Date().getTime(),
        message: text,
        keyboard: keyboard,
      });

      return result[0].message_id || result[0].conversation_message_id;
    } catch (e) {
      this.log.error(`Send message to ${peerId} failed`);
      this.log.error(util.inspect(e, false, null, true));
    }
  }

  public async editMessage(
    peerId: number,
    messageId: number,
    isConversation: boolean,
    text: string,
    keyboard?: string,
  ): Promise<void> {
    const messageIdAdd = isConversation ? { conversation_message_id: messageId } : { message_id: messageId };
    try {
      await this.vkApi.api.messages.edit({
        peer_id: peerId,
        message: text,
        ...messageIdAdd,
        keyboard: keyboard,
      });
    } catch (e) {
      this.log.error(`Edit message to ${peerId}:${messageId} failed`);
      this.log.error(util.inspect(e, false, null, true));
    }
  }

  public async alertEvent(eventId: string, fromId: number, peerId: number, text: string): Promise<void> {
    try {
      await this.vkApi.api.messages.sendMessageEventAnswer({
        event_id: eventId,
        user_id: fromId,
        peer_id: peerId,
        event_data: JSON.stringify({
          type: 'show_snackbar',
          text: text,
        }),
      });
    } catch (e) {
      this.log.error(`Alert event to ${peerId} failed`);
      this.log.error(util.inspect(e, false, null, true));
    }
  }

  public async getApiUser(userId: number): Promise<{ firstName: string; lastName: string } | undefined> {
    try {
      const [userData] = await this.vkApi.api.users.get({
        user_ids: `${userId}`,
      });

      return {
        firstName: userData.first_name,
        lastName: userData.last_name,
      };
    } catch (e) {
      this.log.error(`Get user request for ${userId} failed`);
      this.log.error(util.inspect(e, false, null, true));
    }
  }

  private async getUserFromVk(ctx: VkBotContext): Promise<User | undefined> {
    const user = await this.userService.get(ctx.message.from_id, SocialSource.VK);
    if (!user) {
      const job = await this.vkProducer.getUser({
        userId: ctx.message.from_id,
      });

      const result = await job.finished();
      if (!result) return;

      const { firstName, lastName } = result;
      return await this.userService.createNew(ctx.message.from_id, firstName, lastName, SocialSource.VK);
    }
    return user;
  }

  private async onEvent(ctx: VkBotContext): Promise<void> {
    this.log.debug(`New message from ${ctx.message.peer_id}`);

    const user = await this.getUserFromVk(ctx);
    if (!user) return;

    const message: any = ctx.message;
    const type: EventType = VkEvent[message.type];

    let ctxData: VkMessageData;
    switch (type) {
      case EventType.ON_MESSAGE:
        ctxData = {
          type: EventType.ON_MESSAGE,
          peerId: message.peer_id,
          fromId: message.from_id,
          text: message.text,
          user: user,
        };
        break;
      case EventType.ON_INLINE_BUTTON:
        ctxData = {
          type: EventType.ON_INLINE_BUTTON,
          peerId: message.peer_id,
          fromId: message.user_id,
          eventId: message.event_id,
          payload: message.payload,
          lastMessageId: message.conversation_message_id,
          user: user,
        };
        break;
    }
    this.handlers.forEach((handler) => this.executeHandler(handler, ctxData));
  }

  private executeHandler(handler: Handler, ctx: VkMessageData): void {
    if (handler.type != ctx.type) return;
    let data;
    switch (handler.type) {
      case EventType.ON_MESSAGE:
        if (!this.isValidMessageHandler(handler, <VkMessageNewData>ctx)) return;
        data = this.buildTextMessage(<VkMessageNewData>ctx);
        break;
      case EventType.ON_INLINE_BUTTON:
        if (!this.isValidCallbackHandler(handler, <VkMessageEventData>ctx)) return;
        data = this.buildCallbackMessage(<VkMessageEventData>ctx);
        break;
    }

    handler
      .callback(data)
      .then()
      .catch((e) => {
        this.log.error(`Handler throw error`);
        this.log.error(util.inspect(e, false, null, true));
      });
  }

  private isValidMessageHandler(metadata: OnMessageMetadata, ctx: VkMessageNewData): boolean {
    const { event, scope } = metadata;

    const isConversation = ctx.peerId > CONVERSATION_START_ID;
    if (scope) {
      if (scope == 'conversation' && !isConversation) return false;
      else if (scope == 'private' && isConversation) return false;
    }

    if (Array.isArray(event)) {
      const existEvent = event.some((value) => {
        return this.checkRegexLike(value, ctx.text);
      });
      return existEvent;
    }

    return this.checkRegexLike(event, ctx.text);
  }

  private checkRegexLike(value: string | RegExp, target: string): boolean {
    let regex: RegExp;
    if (typeof value === 'string') regex = new RegExp(value, 'gi');
    else regex = value;

    return !!target.match(regex);
  }

  private isValidCallbackHandler(metadata: OnInlineButtonMetadata, ctx: VkMessageEventData): boolean {
    const { id } = metadata;
    return id == ctx.payload.id;
  }

  private buildTextMessage(ctx: VkMessageNewData): VkTextMessage {
    const isConversation = ctx.peerId > CONVERSATION_START_ID;
    return {
      text: ctx.text,
      user: ctx.user,
      from: SocialSource.VK,
      type: EventType.ON_MESSAGE,
      send: (text, keyboard?: KeyboardBuilder) => this.sendCallback(ctx, text, keyboard),
      placeholder: (text, keyboard) => this.placeholderCallback(ctx, text, keyboard),
      isConversation: isConversation,
    };
  }

  private buildCallbackMessage(ctx: VkMessageEventData): VkInlineButtonMessage {
    return {
      user: ctx.user,
      from: SocialSource.VK,
      type: EventType.ON_INLINE_BUTTON,
      payload: ctx.payload,
      edit: (text: string, alertText?, keyboard?: KeyboardBuilder) => this.editCallback(ctx, text, keyboard),
      alert: (text: string) => this.alertCallback(ctx, text),
    };
  }

  private async sendCallback(ctx: VkMessageData, text: string, keyboard?: KeyboardBuilder): Promise<void> {
    const keyboardString = keyboard?.toJSON(SocialSource.VK);

    if (ctx.lastMessageId) {
      const isConversation = ctx.peerId > CONVERSATION_START_ID;
      await this.vkProducer.edit({
        peerId: ctx.peerId,
        messageId: ctx.lastMessageId,
        isConversation: isConversation,
        text: text,
        keyboard: keyboardString,
      });
    } else {
      await this.vkProducer.send({
        peerId: ctx.peerId,
        text: text,
        keyboard: keyboardString,
      });
    }
  }

  private async placeholderCallback(ctx: VkMessageData, text: string, keyboard?: KeyboardBuilder): Promise<void> {
    const keyboardString = keyboard?.toJSON(SocialSource.VK);

    const job = await this.vkProducer.send({
      peerId: ctx.peerId,
      text: text,
      keyboard: keyboardString,
    });

    ctx.lastMessageId = await job.finished();
  }

  private async editCallback(ctx: VkMessageData, text: string, keyboard?: KeyboardBuilder): Promise<void> {
    const keyboardString = keyboard?.toJSON(SocialSource.VK);

    await this.vkProducer.edit({
      peerId: ctx.peerId,
      messageId: ctx.lastMessageId,
      isConversation: true,
      text: text,
      keyboard: keyboardString,
    });
  }

  private async alertCallback(ctx: VkMessageEventData, text: string): Promise<void> {
    await this.vkProducer.alert({
      eventId: ctx.eventId,
      fromId: ctx.fromId,
      peerId: ctx.peerId,
      text: text,
    });
  }
}
