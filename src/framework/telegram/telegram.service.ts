import { Inject, Injectable, Logger } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { CallbackQuery as TelegramCallbackQuery, Message as TelegramMessage } from 'node-telegram-bot-api';
import { TG_OPTIONS } from './constants';
import { TelegramModuleOptions } from './telegram-module.options';
import { Handler, OnInlineButtonMetadata, OnMessageMetadata } from '../bot/decorator/handler-metadata.type';
import { Message, TelegramInlineButtonMessage, TelegramTextMessage } from '../bot/type/message.type';
import { EventType } from '../bot/type/metadata-type.enum';
import { SocialSource } from '../bot/type/social.enum';
import { TelegramMessageData } from './telegram-message-data.type';
import { TelegramProducer } from './job/telegram.producer';
import { KeyboardBuilder } from '../bot/keyboard/keyboard.builder';
import { TelegramCallbackData } from './telegram-callback-data.type';
import { UserService } from 'src/modules/user/user.service';
import { User } from '../../modules/user/user.entity';
import { BotException } from '../bot-exception/bot.exception';
import { BotExceptionHandler } from '../bot-exception/bot-exception.handler';
import { ProcessedText, ProcessedTextInstance, TextProcessor } from '../../modules/util/text.processor';
import { OnMessageEventItem } from '../bot/decorator/on-message.decorator';

@Injectable()
export class TelegramService {
  private readonly log = new Logger('Telegram');

  private readonly bot: TelegramBot;
  private handlers: Set<Handler> = new Set<Handler>();

  constructor(
    @Inject(TG_OPTIONS) options: TelegramModuleOptions,
    private readonly telegramProducer: TelegramProducer,
    private readonly userService: UserService,
    private readonly botExceptionHandler: BotExceptionHandler,
  ) {
    this.bot = new TelegramBot(options.token, { polling: false });
    //this.bot.startPolling();
    this.bot.on('message', (ctx) => this.onMessageEvent(ctx));
    this.bot.on('callback_query', (ctx) => this.onCallbackEvent(ctx));
  }

  private static isValidCallbackHandler(metadata: OnInlineButtonMetadata, ctx: TelegramCallbackData): boolean {
    const { id } = metadata;
    if (!ctx.data) return false;
    return id == ctx.data;
  }

  public async sendMessage(chatId: number, text: string, keyboard?: string): Promise<TelegramMessage> {
    try {
      return this.bot.sendMessage(chatId, text, {
        reply_markup: keyboard ? JSON.parse(keyboard) : undefined,
        parse_mode: 'HTML',
      });
    } catch (e) {
      this.log.error(`Send message to ${chatId} failed`);
      this.log.error(e.stack);
    }
  }

  public addHandler(handler: Handler) {
    this.handlers.add(handler);
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
      this.log.error(e.stack);
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
      this.log.error(e.stack);
    }
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
      username: ctx.from.username,
    };

    this.sendCallback(ctxData, TextProcessor.buildSimpleText('PRIVATE_MESSAGES_NOT_AVAILABLE'), undefined, true).then();
    return;
    //this.handlers.forEach((handler) => this.executeMessageHandler(handler, ctxData));
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
      username: ctx.from.username,
    };
    this.handlers.forEach((handler) => this.executeCallbackHandler(handler, ctxData));
  }

  private executeMessageHandler(handler: Handler, ctx: TelegramMessageData): void {
    if (handler.type != EventType.ON_MESSAGE) return;
    if (handler.userStage && handler.userStage != ctx.user.stage) return;
    const checkResult = this.isValidMessageHandler(<OnMessageMetadata>handler, ctx);
    if (!checkResult) return;

    const data: Message = this.buildTextMessage(ctx, checkResult);
    this.executeHandler(handler, data, ctx).then();
  }

  private isValidMessageHandler(metadata: OnMessageMetadata, ctx: TelegramMessageData): OnMessageEventItem | undefined {
    const { event, scope } = metadata;

    if (scope) {
      if (scope == 'conversation') return;
    }

    if (Array.isArray(event)) {
      for (const value of event) {
        const checkResult = this.checkRegexLike(value, ctx.text, ctx.user.locale);
        if (checkResult) return checkResult;
      }
    }

    return this.checkRegexLike(<OnMessageEventItem>event, ctx.text, ctx.user.locale);
  }

  private executeCallbackHandler(handler: Handler, ctx: TelegramCallbackData): void {
    if (handler.type != EventType.ON_INLINE_BUTTON) return;
    if (handler.userStage && handler.userStage != ctx.user.stage) return;
    if (!TelegramService.isValidCallbackHandler(<OnInlineButtonMetadata>handler, ctx)) return;

    const data: Message = this.buildCallbackMessage(ctx);
    this.executeHandler(handler, data, ctx).then();
  }

  private buildTextMessage(ctx: TelegramMessageData, value: OnMessageEventItem): TelegramTextMessage {
    return {
      text: ctx.text,
      user: ctx.user,
      from: SocialSource.TELEGRAM,
      type: EventType.ON_MESSAGE,
      send: (text, keyboard?, forceNew?) => this.sendCallback(ctx, text, keyboard, forceNew),
      placeholder: (text) => this.placeholderCallback(ctx, text),
      valueHandled: value,
    };
  }

  private buildCallbackMessage(ctx: TelegramCallbackData): TelegramInlineButtonMessage {
    return {
      user: ctx.user,
      from: SocialSource.TELEGRAM,
      type: EventType.ON_INLINE_BUTTON,
      edit: (text, alertText?, keyboard?) => this.editCallback(ctx, text, alertText, keyboard),
      alert: (text, force = false) => this.alertCallback(ctx, text, force),
      send: (text, keyboard?) => this.sendCallback(ctx, text, keyboard, true),
    };
  }

  private async sendCallback(
    ctx: TelegramMessageData | TelegramCallbackData,
    text: ProcessedText,
    keyboard?: KeyboardBuilder,
    forceNew = false,
  ): Promise<void> {
    const message = TextProcessor.buildText(text, ctx.user.locale);
    const keyboardString = keyboard?.toJSON(SocialSource.TELEGRAM, ctx.user.locale);

    if (ctx.lastMessageId && !forceNew) {
      const job = await this.telegramProducer.edit({
        chatId: ctx.user.id,
        messageId: ctx.lastMessageId,
        text: message,
        keyboard: keyboardString,
      });

      const result = await job.finished();
      if (result) ctx.lastMessageId = result.message_id;
    } else {
      await this.telegramProducer.send({
        chatId: ctx.user.id,
        text: message,
        keyboard: keyboardString,
      });
    }
  }

  private async editCallback(
    ctx: TelegramCallbackData,
    text: ProcessedText,
    alertText?: ProcessedTextInstance,
    keyboard?: KeyboardBuilder,
  ): Promise<void> {
    const message = TextProcessor.buildText(text, ctx.user.locale);
    const keyboardString = keyboard?.toJSON(SocialSource.TELEGRAM, ctx.user.locale);

    if (ctx.messageId) {
      const job = await this.telegramProducer.edit({
        chatId: ctx.user.id,
        messageId: ctx.messageId,
        text: message,
        keyboard: keyboardString,
      });
      await this.alertCallback(ctx, alertText);

      const result = await job.finished();
      if (result) ctx.lastMessageId = result.message_id;
    }
  }

  private async placeholderCallback(ctx: TelegramMessageData, text: ProcessedText): Promise<void> {
    const message = TextProcessor.buildText(text, ctx.user.locale);
    const job = await this.telegramProducer.send({
      chatId: ctx.user.id,
      text: message,
    });
    const result = await job.finished();
    ctx.lastMessageId = result.message_id;
  }

  private async alertCallback(ctx: TelegramCallbackData, text?: ProcessedTextInstance, force?: boolean): Promise<void> {
    const message = TextProcessor.buildText([text], ctx.user.locale);
    await this.telegramProducer.alert({
      callbackId: ctx.callbackId,
      text: text ? message : undefined,
      force: force,
    });
  }

  private async executeHandler(
    handler: Handler,
    data: Message,
    ctx: TelegramMessageData | TelegramCallbackData,
  ): Promise<void> {
    try {
      await handler.callback(data);
    } catch (e) {
      this.log.error(`Callback handler throw error`);
      this.log.error(e.stack);

      if (e instanceof BotException) {
        await this.botExceptionHandler.handle({
          exception: e,
          sendCallback: async (text: string) => {
            await this.telegramProducer.send({
              chatId: ctx.user.id,
              text,
            });
          },
          social: SocialSource.TELEGRAM,
          user: ctx.username,
          locale: ctx.user.locale,
        });
      }
    }
  }
}
