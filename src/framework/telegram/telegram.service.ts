import { Inject, Injectable } from '@nestjs/common';
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
import { TelegramModuleOptions } from './telegram-module.options';
import { BaseMiddleware } from '../bot/base.middleware';
import { UserMiddleware } from './middlewares/user.middleware';
import { MessageMiddleware } from './middlewares/message.middleware';
import { MiddlewareExecutor } from '../bot/middleware/middleware.executor';
import { ProviderMiddleware } from '../bot/middleware/provider.middleware';
import { ChatMiddleware } from './middlewares/chat.middleware';
import { ChatEventMiddleware } from './middlewares/chat-event.middleware';
import { BotExtendedContext } from '../bot/type/bot-context.type';
import { InlineKeyMiddleware } from './middlewares/inline-key.middleware';
import { BotService } from '../bot/bot.service';
import { BotIdMiddleware } from './middlewares/bot-id.middleware';
import { BotAction, BotAlertAction, BotEditAction, BotMessageAction } from '../bot/type/bot-action.type';
import { TelegramProducer } from './job/telegram.producer';
import { TelegramKeyboardBuilder } from './telegram-keyboard.builder';
import { BotPayloadType } from '../bot/type/bot-payload-type.enum';
import { TelegramJobSend } from './job/telegram-job-data.type';
import { inspect } from 'util';

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
    });

    /*this.botService.on('send', async (ctx) => {
      if (ctx.context.provider != 'telegram') return;
      await this.onSend(ctx);

      /!*const renderedMessage = ctx.action.text.render();
      await this.bot.sendMessage(ctx.context.chat.key, renderedMessage);*!/
    });*/
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

  private async onMessageEvent(ctx: TelegramMessage): Promise<void> {
    const telegramCtx: TelegramContext = {
      type: 'message',
      ctx: ctx,
    };
    const newCtx: BotExtendedContext<TelegramContextMetadata> = MiddlewareExecutor.Execute(
      telegramCtx,
      this.middlewares,
    );
    newCtx.metadata = {};
    //console.log(inspect(telegramCtx, false, 10, true));
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
    newCtx.metadata = {
      eventId: ctx.id,
    };
    //console.log(inspect(telegramCtx, false, 10, true));
    this.botService.emit('event', newCtx);
  }

  public async onSend(ctx: BotAction<BotMessageAction, TelegramContextMetadata>): Promise<number> {
    const options: TelegramJobSend['options'] = {};

    const message = ctx.action.message.render();
    const keyboard = ctx.action.keyboard && TelegramKeyboardBuilder.Build(ctx.action.keyboard);
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
    ctx.context.metadata = {
      ...ctx.context.metadata,
      lastMessageId: messageId,
    };

    return messageId;
  }

  public async onEdit(ctx: BotAction<BotEditAction, TelegramContextMetadata>): Promise<void> {
    if (!ctx.context.metadata?.eventId) return;
    if (ctx.context.payload.type != BotPayloadType.MESSAGE && ctx.context.payload.type != BotPayloadType.INLINE_KEY)
      return;

    const keyboardBuilder = ctx.action.keyboard?.inline();
    let keyboard;
    if (keyboardBuilder) keyboard = TelegramKeyboardBuilder.Build(keyboardBuilder);

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
        eventId: ctx.context.metadata.eventId,
        text: '',
        show: false,
      }),
    ]);
  }

  public async onAlert(ctx: BotAction<BotAlertAction, TelegramContextMetadata>): Promise<void> {
    if (!ctx.context.metadata?.eventId) return;

    await this.telegramProducer.alert({
      eventId: ctx.context.metadata.eventId,
      text: ctx.action.message.render(),
      show: true,
    });
  }

  public async onFlush(ctx: BotAction<null, TelegramContextMetadata>): Promise<void> {
    if (!ctx.context.metadata?.eventId) return;

    await this.telegramProducer.alert({
      eventId: ctx.context.metadata.eventId,
      text: '',
      show: false,
    });
  }
}
