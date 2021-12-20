import { Inject, Injectable, Logger } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { CallbackQuery as TelegramCallbackQuery, Message as TelegramMessage } from 'node-telegram-bot-api';
import { TG_OPTIONS } from './constants';
import { TelegramModuleOptions } from './telegram-module.options';
import { Handler, OnInlineButtonMetadata, OnMessageMetadata } from '../bot/handler-metadata.type';
import { Message, TelegramInlineButtonMessage, TelegramTextMessage } from '../bot/message.type';
import { EventType } from '../bot/metadata-type.enum';
import { SocialSource } from '../bot/social.enum';
import { TelegramMessageData } from './telegram-message-data.type';
import { TelegramProducer } from './job/telegram.producer';
import { KeyboardBuilder } from '../bot/keyboard/keyboard.builder';
import { TelegramCallbackData } from './telegram-callback-data.type';
import * as util from 'util';
import { UserService } from 'src/user/user.service';
import { User } from '../user/user.entity';

@Injectable()
export class TelegramService {
  private readonly log = new Logger('Telegram');

  private readonly bot: TelegramBot;
  private handlers: Set<Handler> = new Set<Handler>();

  constructor(
    @Inject(TG_OPTIONS) options: TelegramModuleOptions,
    private readonly telegramProducer: TelegramProducer,
    private readonly userService: UserService,
  ) {
    this.bot = new TelegramBot(options.token, { polling: true });
    this.bot.on('message', (ctx) => this.onMessageEvent(ctx));
    this.bot.on('callback_query', (ctx) => this.onCallbackEvent(ctx));
  }

  private static checkRegexLike(value: string | RegExp, target: string): boolean {
    let regex: RegExp;
    if (typeof value === 'string') regex = new RegExp(value, 'gi');
    else regex = value;

    return !!target.match(regex);
  }

  private static isValidCallbackHandler(metadata: OnInlineButtonMetadata, ctx: TelegramCallbackData): boolean {
    const { id } = metadata;
    return id == ctx.data;
  }

  public addHandler(handler: Handler) {
    this.handlers.add(handler);
  }

  public async sendMessage(chatId: number, text: string, keyboard?: string): Promise<TelegramMessage> {
    try {
      return this.bot.sendMessage(chatId, text, {
        reply_markup: JSON.parse(keyboard),
      });
    } catch (e) {
      this.log.error(`Send message to ${chatId} failed`);
      this.log.error(util.inspect(e, false, null, true));
    }
  }

  public async editMessage(
    chatId: number,
    messageId: number,
    text: string,
    keyboard?: string,
  ): Promise<TelegramMessage | undefined> {
    try {
      const result = await this.bot.editMessageText(text, {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: keyboard ? JSON.parse(keyboard) : undefined,
      });

      if (typeof result !== 'boolean') return result;
    } catch (e) {
      this.log.error(`Edit message ${chatId}:${messageId} failed`);
      this.log.error(util.inspect(e, false, null, true));
    }
  }

  public async alertEvent(callbackId: string, text: string, force: boolean): Promise<void> {
    try {
      await this.bot.answerCallbackQuery(callbackId, {
        text: text,
        show_alert: force,
      });
    } catch (e) {
      this.log.error(`Alert event is failed`);
      this.log.error(util.inspect(e, false, null, true));
    }
  }

  private async getUserFromTelegram(ctx: TelegramMessage | TelegramCallbackQuery): Promise<User> {
    const user = await this.userService.get(ctx.from.id, SocialSource.TELEGRAM);
    if (!user) {
      return await this.userService.createNew(
        ctx.from.id,
        ctx.from.first_name,
        ctx.from.last_name,
        SocialSource.TELEGRAM,
      );
    }
    return user;
  }

  private async onMessageEvent(ctx: TelegramMessage): Promise<void> {
    this.log.debug(`New message from ${ctx.from.id}`);

    const user = await this.getUserFromTelegram(ctx);
    const ctxData: TelegramMessageData = {
      text: ctx.text,
      user: user,
    };
    this.handlers.forEach((handler) => this.executeMessageHandler(handler, ctxData));
  }

  private async onCallbackEvent(ctx: TelegramCallbackQuery): Promise<void> {
    this.log.debug(`New callback event from ${ctx.from.id}`);

    const user = await this.getUserFromTelegram(ctx);
    const ctxData: TelegramCallbackData = {
      user: user,
      data: ctx.data,
      callbackId: ctx.id,
      text: ctx.message?.text,
      messageId: ctx.message?.message_id,
    };
    this.handlers.forEach((handler) => this.executeCallbackHandler(handler, ctxData));
  }

  private executeMessageHandler(handler: Handler, ctx: TelegramMessageData): void {
    if (handler.type != EventType.ON_MESSAGE) return;
    if (!this.isValidMessageHandler(<OnMessageMetadata>handler, ctx)) return;

    const data: Message = this.buildTextMessage(ctx);

    handler
      .callback(data)
      .then()
      .catch((e) => {
        this.log.error(`Message handler throw error`);
        this.log.error(util.inspect(e, false, null, true));
      });
  }

  private isValidMessageHandler(metadata: OnMessageMetadata, ctx: TelegramMessageData): boolean {
    const { event, scope } = metadata;

    if (scope) {
      if (scope == 'conversation') return false;
    }

    if (Array.isArray(event)) {
      return event.some((value) => {
        return TelegramService.checkRegexLike(value, ctx.text);
      });
    }

    return TelegramService.checkRegexLike(event, ctx.text);
  }

  private executeCallbackHandler(handler: Handler, ctx: TelegramCallbackData): void {
    if (handler.type != EventType.ON_INLINE_BUTTON) return;
    if (!TelegramService.isValidCallbackHandler(<OnInlineButtonMetadata>handler, ctx)) return;

    const data: Message = this.buildCallbackMessage(ctx);

    handler
      .callback(data)
      .then()
      .catch((e) => {
        this.log.error(`Callback handler throw error`);
        this.log.error(util.inspect(e, false, null, true));
      });
  }

  private buildTextMessage(ctx: TelegramMessageData): TelegramTextMessage {
    return {
      text: ctx.text,
      user: ctx.user,
      from: SocialSource.TELEGRAM,
      type: EventType.ON_MESSAGE,
      send: (text, keyboard?) => this.sendCallback(ctx, text, keyboard),
      placeholder: (text) => this.placeholderCallback(ctx, text),
    };
  }

  private buildCallbackMessage(ctx: TelegramCallbackData): TelegramInlineButtonMessage {
    return {
      user: ctx.user,
      from: SocialSource.TELEGRAM,
      type: EventType.ON_INLINE_BUTTON,
      edit: (text: string, alertText?, keyboard?) => this.editCallback(ctx, text, alertText, keyboard),
      alert: (text, force = false) => this.alertCallback(ctx, text, force),
    };
  }

  private async sendCallback(ctx: TelegramMessageData, text: string, keyboard?: KeyboardBuilder): Promise<void> {
    const keyboardString = keyboard?.toJSON(SocialSource.TELEGRAM);

    if (ctx.lastMessageId) {
      const job = await this.telegramProducer.edit({
        chatId: ctx.user.id,
        messageId: ctx.lastMessageId,
        text,
        keyboard: keyboardString,
      });

      const result = await job.finished();
      if (result) ctx.lastMessageId = result.message_id;
    } else {
      await this.telegramProducer.send({
        chatId: ctx.user.id,
        text,
        keyboard: keyboardString,
      });
    }
  }

  private async editCallback(
    ctx: TelegramCallbackData,
    text: string,
    alertText?: string,
    keyboard?: KeyboardBuilder,
  ): Promise<void> {
    const keyboardString = keyboard?.toJSON(SocialSource.TELEGRAM);

    if (ctx.messageId) {
      const job = await this.telegramProducer.edit({
        chatId: ctx.user.id,
        messageId: ctx.messageId,
        text,
        keyboard: keyboardString,
      });
      await this.alertCallback(ctx, alertText);

      const result = await job.finished();
      if (result) ctx.lastMessageId = result.message_id;
    }
  }

  private async placeholderCallback(ctx: TelegramMessageData, text: string): Promise<void> {
    const job = await this.telegramProducer.send({
      chatId: ctx.user.id,
      text,
    });
    const result = await job.finished();
    ctx.lastMessageId = result.message_id;
  }

  private async alertCallback(ctx: TelegramCallbackData, text?: string, force?: boolean): Promise<void> {
    await this.telegramProducer.alert({
      callbackId: ctx.callbackId,
      text: text,
      force: force,
    });
  }
}
