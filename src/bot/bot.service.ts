import { Injectable } from '@nestjs/common';
import {DateParser} from "../util/DateParser";
import DSTU from "../DSTU/DSTU";
import {TextCompiler} from "../util/TextCompiler";

const VkBot = require('node-vk-bot-api');
const Markup = require('node-vk-bot-api/lib/markup');
const api = require('node-vk-bot-api/lib/api');

export const SCHEDULE_ACTIVATION = /расписание( пар)?.*/ig;
export const WHAT_ACTIVATION = /(что|чо|шо) (?!на завтра)(на|завтра|у нас завтра|по парам).*/ig;
export const WHOM_ACTIVATION = /(.*какие .*?(пары).*|пары.*?какие)/ig;
export const AT_ACTIVATION = /пары (на|в).*/ig;

@Injectable()
export class BotService {
  public bot;

  constructor() {
    this.bot = new VkBot({
      token: process.env.BOT_TOKEN,
      confirmation: process.env.CONFIRMATION,
    });

    this.onMessage = this.onMessage.bind(this);
    this.bot.on(this.onMessage);
  }

  private async onMessage(ctx) {
    if (ctx.message.peer_id < 2000000000) return;

    if (ctx.message.text.match(SCHEDULE_ACTIVATION) ||
        ctx.message.text.match(WHAT_ACTIVATION) ||
        ctx.message.text.match(WHOM_ACTIVATION) ||
        ctx.message.text.match(AT_ACTIVATION)) await this.onActivate(ctx);
  }

  async onActivate(ctx) {
    const atDate = DateParser.Parse(ctx.message.text);
    const rasp = await DSTU.getRasp(atDate.date);
    ctx.reply(TextCompiler.Compile(rasp, atDate.mnemonic));
  }

 /* async onButton(ctx) {
    const payload = ctx.message.payload;
    switch (payload.action) {
      case 'add':
        return this.onAddUser(ctx, payload);
      case 'remove':
        return this.onRemoveUser(ctx, payload);
      case 'delete':
        return this.onDeleteQueue(ctx, payload);
    }
  }

  async onAddUser(ctx, payload) {
    const queueUsers = await this.queueUserService.queueUsers({
      queue_id: payload.queue_id,
      vk_id: ctx.message.user_id,
    });

    if (queueUsers.length > 0) {
      await this.snackBarShow(ctx, 'Ты уже добавлен в список');
      return;
    }

    const userInfo = await this.getUserName(ctx.message.user_id);

    await this.queueUserService.createQueueUser({
      Queue: {
        connect: {
          id: payload.queue_id,
        },
      },
      first_name: userInfo.first_name,
      last_name: userInfo.last_name,
      vk_id: userInfo.id,
    });

    const queue = await this.queueService.queue(
      {
        id: payload.queue_id,
      },
      {
        QueueUser: true,
      },
    );

    await this.genText(
      ctx.message.conversation_message_id,
      ctx.message.peer_id,
      queue,
    );
    await this.snackBarShow(ctx, 'Ты был добавлен в список!');
  }

  async onRemoveUser(ctx, payload) {
    const queueUsers = await this.queueUserService.queueUsers({
      queue_id: payload.queue_id,
      vk_id: ctx.message.user_id,
    });

    if (queueUsers.length < 1) {
      await this.snackBarShow(ctx, 'Тебя нет в этом списке');
      return;
    }

    await this.queueUserService.deleteQueueUser({
      id: queueUsers[0].id,
    });

    const queue = await this.queueService.queue(
      {
        id: payload.queue_id,
      },
      {
        QueueUser: true,
      },
    );

    await this.genText(
      ctx.message.conversation_message_id,
      ctx.message.peer_id,
      queue,
    );
    await this.snackBarShow(ctx, 'Ты был удален из списка!');
  }

  async genText(message_id: number, peer_id: number, queue: QueueExtendType) {
    let message = `#${queue.name}_список

Нам всем пизда!

`;

    if (queue.QueueUser.length < 1) message += 'В этом списке пока пусто...';
    queue.QueueUser.forEach((user, index) => {
      message += `${index + 1}. ${user.first_name} ${user.last_name}\n`;
    });

    try {
      await this.bot.execute('messages.edit', {
        peer_id: peer_id,
        conversation_message_id: message_id,
        message: message,
        keyboard: DefaultKeyboard(queue.id),
      });
    } catch (e) {
      console.log(e);
    }
  }

  async snackBarShow(ctx, message: string) {
    try {
      await this.bot.execute('messages.sendMessageEventAnswer', {
        event_id: ctx.message.event_id,
        user_id: ctx.message.user_id,
        peer_id: ctx.message.peer_id,
        event_data: JSON.stringify({
          type: 'show_snackbar',
          text: message,
        }),
      });
    } catch (e) {
      console.log(e);
    }
  }

  async getUserName(userId: number): Promise<UserInfoInterface> {
    try {
      const response = await api('users.get', {
        user_ids: userId,
        access_token: process.env.BOT_TOKEN,
      });

      return response.response[0];
    } catch (e) {
      console.log(e);
    }
  }*/
}
