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
import { BotIdMiddleware } from './middlewares/bot-id.middleware';
import { UserEntity } from '../../modules/user/user.entity';

@Injectable()
export class VkService {
  public readonly bot: VkBot;
  private readonly log = new Logger('VK NEW');
  private readonly vkApi: VK;

  private readonly middlewares: BaseMiddleware[];
  private readonly providerName = 'vk';

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
        if (!(e instanceof Error)) return;
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
      new ProviderMiddleware(this.providerName),
      new UserMiddleware(),
      new ChatMiddleware(),
      new ChatEventMiddleware(),
      new MessageMiddleware(),
      new InlineKeyMiddleware(),
      new BotIdMiddleware(),
    ];

    this.botService.registerProvider(this.providerName, {
      send: () => Promise.resolve(1),
      edit: () => Promise.resolve(),
      alert: () => Promise.resolve(),
      flush: () => Promise.resolve(),
      getUser: this.getUser,
    });

    //this.botService.on('get-user-request', (ctx) => this.getUser(ctx));
  }

  public onEvent(ctx: VkBotContext): void {
    const newCtx: BotContext = MiddlewareExecutor.Execute(ctx, this.middlewares);
    this.botService.emit('event', newCtx);
  }

  public async getUser(ctx: BotContext): Promise<UserEntity> {
    return new UserEntity({
      provider: ctx.provider,
      externalId: ctx.from.id,
    });
  }
}
