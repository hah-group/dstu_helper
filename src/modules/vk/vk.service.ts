import { Inject, Injectable, Logger } from '@nestjs/common';
import { VK_OPTIONS } from './constants';
import { VK } from 'vk-io';
import { VkModuleOptions } from './vk-module.options';
import VkBot from 'node-vk-bot-api';
import {
  Handler,
  OnInlineButtonMetadata,
  OnInviteMetadata,
  OnMessageMetadata,
} from '../bot/decorator/handler-metadata.type';
import { VkMessageData, VkMessageEventData, VkMessageInviteData, VkMessageNewData } from './vk-message-data.type';
import { VkEvent } from './vk-event.definition';
import { EventType } from '../bot/type/metadata-type.enum';
import { VkInlineButtonMessage, VkInviteMessage, VkTextMessage } from '../bot/type/message.type';
import { SocialSource } from '../bot/type/social.enum';
import { VkProducer } from './job/vk.producer';
import { KeyboardBuilder } from '../bot/keyboard/keyboard.builder';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { VkJobAlert, VkJobEdit } from './job/vk-job-data.type';
import { BotException } from '../bot-exception/bot.exception';
import { BotExceptionHandler } from '../bot-exception/bot-exception.handler';
import { UnknownException } from '../bot-exception/exception/unknown.exception';
import { ProcessedText, ProcessedTextInstance, TextProcessor } from '../util/text.processor';
import { OnMessageEventItem } from '../bot/decorator/on-message.decorator';
import { VkConversationInfo } from './vk-conversation-info.type';

const CONVERSATION_START_ID = 2000000000;

@Injectable()
export class VkService {
  private readonly log = new Logger('VK');

  private readonly vkApi: VK;
  public readonly bot: VkBot;
  private handlers: Set<Handler> = new Set<Handler>();

  constructor(
    @Inject(VK_OPTIONS) options: VkModuleOptions,
    private readonly vkProducer: VkProducer,
    private readonly userService: UserService,
    private readonly botExceptionHandler: BotExceptionHandler,
  ) {
    this.vkApi = new VK({
      token: options.token,
      apiVersion: '5.144',
    });

    this.bot = new VkBot({
      token: options.token,
      group_id: options.groupId,
      confirmation: options.confirmation,
    });

    this.bot.use((ctx) => {
      try {
        this.onEvent(ctx);
      } catch (e) {
        this.log.error(`Global event handler throw error`);
        this.log.error(e.stack);
      }
    });

    if (process.env.USE_POLLING == 'true') {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.bot.startPolling((err) => {
        this.log.warn(`Polling started (can be only dev env)`);
      });
    }
  }

  public async getConversationInfo(conversationId: number): Promise<VkConversationInfo> {
    const response = await this.vkApi.api.messages.getConversationsById({
      peer_ids: conversationId,
      extended: true,
    });
    const profiles = await this.vkApi.api.messages.getConversationMembers({
      peer_id: conversationId,
      count: 200,
    });
    if (response.count < 1) throw new Error('Forbidden');
    return {
      chat: response.items[0].chat_settings,
      profiles: profiles.profiles,
    };
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
      this.log.error(e.stack);
    }
  }

  public async editMessage(params: Omit<VkJobEdit, 'type'>): Promise<void> {
    const { eventId, isConversation, keyboard, messageId, peerId, text, fromId } = params;
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
      this.log.error(e.stack);

      if (eventId) {
        this.log.debug(`Reset event answer`);
        await this.alertEvent({ eventId, fromId, peerId });
      }

      this.log.debug(`Try send message`);
      await this.sendMessage(peerId, text, keyboard);
    }
  }

  public async alertEvent(params: Omit<VkJobAlert, 'type'>): Promise<void> {
    const { eventId, fromId, peerId, text } = params;
    try {
      const eventData = JSON.stringify({
        type: 'show_snackbar',
        text: text,
      });

      await this.vkApi.api.messages.sendMessageEventAnswer({
        event_id: eventId,
        user_id: fromId,
        peer_id: peerId,
        event_data: text ? eventData : undefined,
      });
    } catch (e) {
      this.log.error(`Alert event to ${peerId} failed`);
      this.log.error(e.stack);
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
      this.log.error(e.stack);
    }
  }

  private async getUserFromVk(userId: number): Promise<User | undefined> {
    const user = await this.userService.get(userId, SocialSource.VK);
    if (!user) {
      this.log.log(`New user ${userId}`);
      const job = await this.vkProducer.getUser({
        userId: userId,
      });

      const result = await job.finished();
      if (!result) return;

      const { firstName, lastName } = result;
      return await this.userService.createNew(userId, firstName, lastName, SocialSource.VK);
    }
    return user;
  }

  private async onEvent(ctx: VkBotContext): Promise<void> {
    this.log.debug(`New message from ${ctx.message.peer_id}`);

    const message: any = ctx.message;
    const type: EventType = VkEvent[message.type];

    const userId = message.from_id || message.user_id;
    if (userId < 0) return;

    const user = await this.getUserFromVk(userId);
    if (!user) return;

    let ctxData: VkMessageData | undefined;
    switch (type) {
      case EventType.ON_MESSAGE:
        ctxData = await this.onMessageParse(message, user);
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

    if (type != EventType.ON_INLINE_BUTTON) {
      const isConversation = ctxData.peerId > CONVERSATION_START_ID;
      if (!isConversation) {
        this.sendCallback(
          ctxData,
          TextProcessor.buildSimpleText('PRIVATE_MESSAGES_NOT_AVAILABLE'),
          undefined,
          true,
        ).then();
        return;
      }
    }

    this.handlers.forEach((handler) => ctxData && this.processHandler(handler, ctxData));
  }

  private async onMessageParse(message: any, user: User): Promise<VkMessageData | undefined> {
    if (message.action && message.action.type == 'chat_invite_user') {
      const invitedUser = message.action.member_id > 0 ? await this.getUserFromVk(message.action.member_id) : undefined;
      return {
        type: EventType.ON_INVITE,
        peerId: message.peer_id,
        fromId: message.from_id,
        memberId: message.action.member_id,
        user: user,
        invitedUser: invitedUser,
      };
    } else if (!message.action)
      return {
        type: EventType.ON_MESSAGE,
        peerId: message.peer_id,
        fromId: message.from_id,
        text: message.text,
        user: user,
      };
  }

  private processHandler(handler: Handler, ctx: VkMessageData): void {
    if (handler.type != ctx.type) return;
    if (handler.userStage && handler.userStage != ctx.user.stage) return;

    let data;
    switch (handler.type) {
      case EventType.ON_MESSAGE:
        const checkResult = this.isValidMessageHandler(handler, <VkMessageNewData>ctx);
        if (!checkResult) return;
        data = this.buildTextMessage(<VkMessageNewData>ctx, checkResult);
        break;
      case EventType.ON_INLINE_BUTTON:
        if (!this.isValidCallbackHandler(handler, <VkMessageEventData>ctx)) return;
        data = this.buildCallbackMessage(<VkMessageEventData>ctx);
        break;
      case EventType.ON_INVITE:
        if (!this.isValidInviteHandler(handler, <VkMessageInviteData>ctx)) return;
        data = this.buildInviteMessage(<VkMessageInviteData>ctx);
        break;
    }

    this.executeHandler(handler, data, ctx).then();
  }

  private isValidMessageHandler(metadata: OnMessageMetadata, ctx: VkMessageNewData): OnMessageEventItem | undefined {
    const { event, scope } = metadata;

    const isConversation = ctx.peerId > CONVERSATION_START_ID;

    if (scope) {
      if (scope == 'conversation' && !isConversation) return;
      else if (scope == 'private' && isConversation) return;
    }

    if (Array.isArray(event)) {
      for (const value of event) {
        const checkResult = this.checkRegexLike(value, ctx.text, ctx.user.locale);
        if (checkResult) return checkResult;
      }
    }

    return this.checkRegexLike(<OnMessageEventItem>event, ctx.text, ctx.user.locale);
  }

  private checkRegexLike(
    value: OnMessageEventItem | undefined,
    target: string,
    locale: string,
  ): OnMessageEventItem | undefined {
    if (typeof value === 'undefined') return target;

    let checkingValue: string | RegExp | undefined;

    if (<ProcessedTextInstance>value && (<ProcessedTextInstance>value).phrase)
      checkingValue = TextProcessor.buildText([<ProcessedTextInstance>value], locale);
    else if (typeof value === 'string') checkingValue = value;
    else checkingValue = <RegExp>value;

    const regex = new RegExp(checkingValue, 'gi');
    return target.match(regex) ? value : undefined;
  }

  private isValidCallbackHandler(metadata: OnInlineButtonMetadata, ctx: VkMessageEventData): boolean {
    const { id } = metadata;
    if (!ctx.payload.id) return false;
    return id == ctx.payload.id;
  }

  private isValidInviteHandler(metadata: OnInviteMetadata, ctx: VkMessageInviteData): boolean {
    const groupId = parseInt(process.env.GROUP_ID) * -1;
    if (metadata.scope == 'iam' && groupId == ctx.memberId) return true;
    if (metadata.scope == 'user' && ctx.memberId > 0) return true;
    return false;
  }

  private buildTextMessage(ctx: VkMessageNewData, value: OnMessageEventItem): VkTextMessage {
    const isConversation = ctx.peerId > CONVERSATION_START_ID;
    return {
      text: ctx.text,
      user: ctx.user,
      from: SocialSource.VK,
      type: EventType.ON_MESSAGE,
      send: (text, keyboard?: KeyboardBuilder, forceNew?) => this.sendCallback(ctx, text, keyboard, forceNew),
      placeholder: (text, keyboard) => this.placeholderCallback(ctx, text, keyboard),
      isConversation: isConversation,
      valueHandled: value,
      peerId: ctx.peerId,
    };
  }

  private buildCallbackMessage(ctx: VkMessageEventData): VkInlineButtonMessage {
    return {
      user: ctx.user,
      from: SocialSource.VK,
      type: EventType.ON_INLINE_BUTTON,
      payload: ctx.payload,
      peerId: ctx.peerId,
      edit: (text, alertText?, keyboard?) => this.editCallback(ctx, text, keyboard),
      alert: (text) => this.alertCallback(ctx, text),
      send: (text, keyboard) => this.sendCallback(ctx, text, keyboard, true),
    };
  }

  private buildInviteMessage(ctx: VkMessageInviteData): VkInviteMessage {
    return {
      fromUser: ctx.user,
      from: SocialSource.VK,
      type: EventType.ON_INVITE,
      invitedUser: ctx.invitedUser,
      peerId: ctx.peerId,
      send: (text, keyboard) => this.sendCallback(ctx, text, keyboard, true),
    };
  }

  private async sendCallback(
    ctx: VkMessageData,
    text: ProcessedText,
    keyboard?: KeyboardBuilder,
    forceNew = false,
  ): Promise<void> {
    const keyboardString = keyboard?.toJSON(SocialSource.VK, ctx.user.locale);
    const message = TextProcessor.buildText(text, ctx.user.locale);

    if (ctx.lastMessageId && !forceNew) {
      const isConversation = ctx.peerId > CONVERSATION_START_ID;
      await this.vkProducer.edit({
        fromId: ctx.fromId,
        peerId: ctx.peerId,
        messageId: ctx.lastMessageId,
        isConversation: isConversation,
        text: message,
        keyboard: keyboardString,
      });
    } else {
      await this.vkProducer.send({
        peerId: ctx.peerId,
        text: message,
        keyboard: keyboardString,
      });
    }
  }

  private async placeholderCallback(
    ctx: VkMessageData,
    text: ProcessedText,
    keyboard?: KeyboardBuilder,
  ): Promise<void> {
    const message = TextProcessor.buildText(text, ctx.user.locale);
    const keyboardString = keyboard?.toJSON(SocialSource.VK, ctx.user.locale);

    const job = await this.vkProducer.send({
      peerId: ctx.peerId,
      text: message,
      keyboard: keyboardString,
    });

    ctx.lastMessageId = await job.finished();
  }

  private async editCallback(
    ctx: VkMessageData | VkMessageEventData,
    text: ProcessedText,
    keyboard?: KeyboardBuilder,
  ): Promise<void> {
    const message = TextProcessor.buildText(text, ctx.user.locale);
    const keyboardString = keyboard?.toJSON(SocialSource.VK, ctx.user.locale);

    await this.vkProducer.edit({
      fromId: ctx.fromId,
      peerId: ctx.peerId,
      messageId: ctx.lastMessageId,
      isConversation: true,
      text: message,
      keyboard: keyboardString,
      eventId: ctx.type == EventType.ON_INLINE_BUTTON ? ctx.eventId : undefined,
    });
  }

  private async alertCallback(ctx: VkMessageEventData, text: ProcessedTextInstance): Promise<void> {
    const message = TextProcessor.buildText([text], ctx.user.locale);
    await this.vkProducer.alert({
      eventId: ctx.eventId,
      fromId: ctx.fromId,
      peerId: ctx.peerId,
      text: message,
    });
  }

  private async executeHandler(handler: Handler, data: any, ctx: VkMessageData): Promise<void> {
    try {
      await handler.callback(data);
    } catch (e) {
      this.log.error(`Callback handler throw error`);
      this.log.error(e.stack);

      let sendException;

      if (e instanceof BotException) sendException = e;
      else sendException = new UnknownException(e);

      await this.botExceptionHandler.handle({
        exception: sendException,
        sendCallback: async (text: string) => {
          await this.vkProducer.send({
            peerId: ctx.peerId,
            text: text,
          });
        },
        social: SocialSource.VK,
        user: `${ctx.user.id}`,
        locale: ctx.user.locale,
      });
    }
  }
}
