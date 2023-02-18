import {
  BaseMiddleware,
  BotAction,
  BotAlertAction,
  BotBroadcastAction,
  BotEditAction,
  BotExtendedContext,
  BotMessageAction,
  BotPayloadType,
  BotService,
  delay,
  MiddlewareExecutor,
  ProviderMiddleware,
} from '@dstu_helper/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import {
  CallbackQuery,
  EditMessageReplyMarkupOptions,
  EditMessageTextOptions,
  InlineKeyboardMarkup,
  Message as TGMessage,
  ReplyKeyboardMarkup,
  ReplyKeyboardRemove,
  SendMessageOptions,
} from 'node-telegram-bot-api';

import { TG_OPTIONS } from './constants';
import { TelegramProducer } from './job/telegram.producer';
import { TelegramJobSend } from './job/telegram-job-data.type';
import { BotIdMiddleware } from './middlewares/bot-id.middleware';
import { ChatMiddleware } from './middlewares/chat.middleware';
import { ChatEventMiddleware } from './middlewares/chat-event.middleware';
import { InlineKeyMiddleware } from './middlewares/inline-key.middleware';
import { MessageMiddleware } from './middlewares/message.middleware';
import { UserMiddleware } from './middlewares/user.middleware';
import { TelegramKeyboardBuilder } from './telegram-keyboard.builder';
import { TelegramModuleOptions } from './telegram-module.options';

export type TelegramMessage = TGMessage;
export type TelegramCallbackQuery = CallbackQuery;

export type TelegramKeyboard = TelegramInlineKeyboard | TelegramReplyKeyboard | TelegramRemoveKeyboard;
export type TelegramInlineKeyboard = InlineKeyboardMarkup;
export type TelegramReplyKeyboard = ReplyKeyboardMarkup;
export type TelegramRemoveKeyboard = ReplyKeyboardRemove;

export type TelegramContext =
  | {
      type: 'message';
      ctx: TelegramMessage;
    }
  | {
      type: 'callback_query';
      ctx: CallbackQuery;
    };

export interface TelegramContextMetadata {
  lastMessageId?: number;
  eventId?: string;
}

export type TelegramSendOptions = SendMessageOptions;
export type TelegramEditMessageOptions = EditMessageTextOptions;
export type TelegramEditKeyboardOptions = EditMessageReplyMarkupOptions;

@Injectable()
export class TelegramService {
  private readonly log = new Logger('Telegram');
  private readonly bot: TelegramBot;
  private readonly middlewares: BaseMiddleware[];
  private readonly providerName = 'telegram';

  constructor(
    @Inject(TG_OPTIONS) options: TelegramModuleOptions,
    private readonly botService: BotService,
    private readonly telegramProducer: TelegramProducer,
  ) {
    this.bot = new TelegramBot(options.token, { polling: true });
    this.bot.on('message', (ctx) => this.onMessageEvent(ctx));
    this.bot.on('callback_query', (ctx) => this.onCallbackEvent(ctx));
    this.middlewares = [
      new ProviderMiddleware(this.providerName),
      new ChatMiddleware(),
      new ChatEventMiddleware(),
      new UserMiddleware(),
      new MessageMiddleware(),
      new InlineKeyMiddleware(),
      new BotIdMiddleware(),
    ];

    this.botService.registerProvider(this.providerName, {
      send: (ctx) => this.onSend(ctx),
      edit: (ctx) => this.onEdit(ctx),
      alert: (ctx) => this.onAlert(ctx),
      flush: (ctx) => this.onFlush(ctx),
      broadcast: (ctx) => this.onBroadcast(ctx),
    });
  }

  public async sendMessage(chatId: number, message: string, options: TelegramSendOptions): Promise<number> {
    const sentMessage = await this.bot.sendMessage(chatId, message, options);
    return sentMessage.message_id;
  }

  public async editMessage(
    chatId: number,
    messageId: number,
    text?: string,
    keyboard?: TelegramKeyboard,
  ): Promise<void> {
    try {
      if (text) {
        await this.bot.editMessageText(text, {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: keyboard ? <InlineKeyboardMarkup>keyboard : undefined,
        });
      } else if (keyboard) {
        await this.bot.editMessageReplyMarkup(<InlineKeyboardMarkup>keyboard, {
          chat_id: chatId,
          message_id: messageId,
        });
      }
    } catch (e) {
      if (text) await this.sendMessage(chatId, text, { reply_markup: keyboard });
    }
  }

  public async sendAlert(eventId: string, text: string): Promise<void> {
    await this.bot.answerCallbackQuery(eventId, {
      text: text,
      show_alert: true,
    });
  }

  public async onSend(ctx: BotAction<BotMessageAction, TelegramContextMetadata>): Promise<number> {
    const options: TelegramJobSend['options'] = {};

    const message = ctx.action.message.render(ctx.context.from.user);
    const keyboard = ctx.action.keyboard && TelegramKeyboardBuilder.Build(ctx.action.keyboard, false);
    //console.log(inspect(keyboard, false, 10, true));
    if (keyboard) options.reply_markup = keyboard;

    if (ctx.action.options?.reply && ctx.context.payload.type == BotPayloadType.MESSAGE)
      options.reply_to_message_id = ctx.context.payload.messageId;

    let chatId = ctx.context.chat.id;
    if (ctx.action.options?.forcePrivate) chatId = ctx.context.from.id;

    const job = await this.telegramProducer.send({
      chatId: chatId,
      message: message,
      options: options,
    });

    const messageId = await job.finished();
    ctx.context.botMetadata = {
      ...ctx.context.botMetadata,
      lastMessageId: messageId,
    };

    return messageId;
  }

  public async onEdit(ctx: BotAction<BotEditAction, TelegramContextMetadata>): Promise<void> {
    if (!ctx.context.botMetadata?.eventId) return;
    if (ctx.context.payload.type != BotPayloadType.MESSAGE && ctx.context.payload.type != BotPayloadType.INLINE_KEY)
      return;

    const keyboardBuilder = ctx.action.keyboard;
    let keyboard;
    if (keyboardBuilder) keyboard = TelegramKeyboardBuilder.Build(keyboardBuilder, true);

    let message;
    if (ctx.action.message) message = ctx.action.message.render();

    await Promise.all([
      this.telegramProducer.edit({
        chatId: ctx.context.chat.id,
        messageId: ctx.context.payload.messageId,
        text: message,
        keyboard: keyboard,
      }),
      this.telegramProducer.alert({
        eventId: ctx.context.botMetadata.eventId,
        text: '',
        show: false,
      }),
    ]);
  }

  public async onAlert(ctx: BotAction<BotAlertAction, TelegramContextMetadata>): Promise<void> {
    if (!ctx.context.botMetadata?.eventId) return;

    await this.telegramProducer.alert({
      eventId: ctx.context.botMetadata.eventId,
      text: ctx.action.message.render(),
      show: true,
    });
  }

  public async onFlush(ctx: BotAction<null, TelegramContextMetadata>): Promise<void> {
    if (!ctx.context.botMetadata?.eventId) return;

    await this.telegramProducer.alert({
      eventId: ctx.context.botMetadata.eventId,
      text: '',
      show: false,
    });
  }

  private async onMessageEvent(ctx: TelegramMessage): Promise<void> {
    const telegramCtx: TelegramContext = {
      type: 'message',
      ctx: ctx,
    };
    const newCtx: BotExtendedContext<TelegramContextMetadata> = MiddlewareExecutor.Execute(
      telegramCtx,
      this.middlewares,
    );
    newCtx.coreMetadata = {
      requestTime: Date.now(),
    };
    this.botService.emit('event', newCtx);
  }

  private async onCallbackEvent(ctx: TelegramCallbackQuery): Promise<void> {
    const telegramCtx: TelegramContext = {
      type: 'callback_query',
      ctx: ctx,
    };
    const newCtx: BotExtendedContext<TelegramContextMetadata> = MiddlewareExecutor.Execute(
      telegramCtx,
      this.middlewares,
    );
    newCtx.botMetadata = {
      eventId: ctx.id,
    };
    newCtx.coreMetadata = {
      requestTime: Date.now(),
    };
    this.botService.emit('event', newCtx);
  }

  private async onBroadcast(ctx: BotBroadcastAction): Promise<void> {
    const startTime = Date.now();
    this.log.log(`Start broadcasting for ${ctx.targetIds.length} targets`);

    let i = 0;
    for (const targetId of ctx.targetIds) {
      this.log.log(`Send message to targetId: ${targetId}`);

      const job = await this.telegramProducer.send({
        chatId: targetId,
        message: ctx.message.render(),
        options: {},
      });
      const messageId = await job.finished();
      i += 1;

      if (messageId > -1 || i != ctx.targetIds.length) {
        this.log.log(`Message success sent to targetId: ${targetId}. Delay 10 seconds`);
        await delay(10000);
      } else {
        this.log.log(`Message sent failed for targetId: ${targetId}. Delay 30 seconds`);
        await delay(30000);
      }
    }

    this.log.log(`Broadcasting for ${ctx.targetIds.length} targets is ended (${(Date.now() - startTime) / 1000} s)`);
  }
}
