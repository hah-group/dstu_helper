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
import { BotContext } from '../bot/type/bot-context.type';
import { InlineKeyMiddleware } from './middlewares/inline-key.middleware';
import { BotService } from '../bot/bot.service';

@Injectable()
export class VkNewService {
  public readonly bot: VkBot;
  private readonly log = new Logger('VK NEW');
  private readonly vkApi: VK;

  private readonly middlewares: BaseMiddleware[];

  constructor(@Inject(VK_OPTIONS) options: VkModuleOptions, private readonly botService: BotService) {
    this.vkApi = new VK({
      token: options.token,
      apiVersion: '5.144',
    });

    this.bot = new VkBot({
      token: options.token,
      group_id: options.groupId,
      confirmation: options.confirmation,
    });

    this.bot.use(async (ctx) => {
      try {
        await this.onEvent(ctx);
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

    this.middlewares = [
      new ProviderMiddleware('vk'),
      new UserMiddleware(),
      new ChatMiddleware(),
      new ChatEventMiddleware(),
      new MessageMiddleware(),
      new InlineKeyMiddleware(),
    ];
  }

  public onEvent(ctx: VkBotContext): void {
    const newCtx: BotContext = MiddlewareExecutor.Execute(ctx, this.middlewares);
    this.botService.emit('event', newCtx);
  }
}
