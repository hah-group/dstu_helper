import { Inject, Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import { CallbackQuery, Message as TGMessage } from 'node-telegram-bot-api';
import { TG_OPTIONS } from './constants';
import { TelegramModuleOptions } from './telegram-module.options';
import { BaseMiddleware } from '../bot/base.middleware';
import { UserMiddleware } from './middlewares/user.middleware';
import { MessageMiddleware } from './middlewares/message.middleware';
import { MiddlewareExecutor } from '../bot/middleware.executor';
import { ProviderMiddleware } from '../bot/middleware/provider.middleware';
import { ChatMiddleware } from './middlewares/chat.middleware';
import { ChatEventMiddleware } from './middlewares/chat-event.middleware';
import { BotContext } from '../bot/type/bot-context.type';
import { InlineKeyMiddleware } from './middlewares/inline-key.middleware';
import { BotService } from '../bot/bot.service';

export type TelegramMessage = TGMessage;
export type TelegramCallbackQuery = CallbackQuery;

export type TelegramContext =
  | {
      type: 'message';
      ctx: TelegramMessage;
    }
  | {
      type: 'callback_query';
      ctx: CallbackQuery;
    };

@Injectable()
export class TelegramNewService {
  private readonly bot: TelegramBot;
  private readonly middlewares: BaseMiddleware[];

  constructor(@Inject(TG_OPTIONS) options: TelegramModuleOptions, private readonly botService: BotService) {
    this.bot = new TelegramBot(options.token, { polling: true });
    this.bot.on('message', (ctx) => this.onMessageEvent(ctx));
    this.bot.on('callback_query', (ctx) => this.onCallbackEvent(ctx));
    this.middlewares = [
      new ProviderMiddleware('telegram'),
      new ChatMiddleware(),
      new ChatEventMiddleware(),
      new UserMiddleware(),
      new MessageMiddleware(),
      new InlineKeyMiddleware(),
    ];
  }

  private async onMessageEvent(ctx: TelegramMessage): Promise<void> {
    const telegramCtx: TelegramContext = {
      type: 'message',
      ctx: ctx,
    };
    const newCtx: BotContext = MiddlewareExecutor.Execute(telegramCtx, this.middlewares);
    this.botService.emit('event', newCtx);
  }

  private async onCallbackEvent(ctx: TelegramCallbackQuery): Promise<void> {
    const telegramCtx: TelegramContext = {
      type: 'callback_query',
      ctx: ctx,
    };
    const newCtx: BotContext = MiddlewareExecutor.Execute(telegramCtx, this.middlewares);
    this.botService.emit('event', newCtx);
  }
}
