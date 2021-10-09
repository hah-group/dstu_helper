import { Injectable } from '@nestjs/common';
import {DateParser} from "../util/DateParser";
import DSTU from "../DSTU/DSTU";
import {TextCompiler} from "../util/TextCompiler";
import {VkIoService} from "../vk-io/vk-io.service";

const VkBot = require('node-vk-bot-api');

export const SCHEDULE_ACTIVATION = /расписание( пар)?.*/ig;
export const WHAT_ACTIVATION = /(что|чо|шо|че|чё) (?!на завтра)(на |у нас завтра|по парам).*/ig;
export const WHOM_ACTIVATION = /(.*какие .*?(пары).*|пары.*?какие)/ig;
export const AT_ACTIVATION = /пары (на|в|во).*/ig;

export const WHERE_AUDIENCE = /(куда|где|какая).{1,20}(идти|пара|аудитория)/ig;

export const NEXT_ACTIVATION = /^(какая |где |что )?(некст|следующая|след)( пара)?$/ig;

export const START_STOP_ACTIVATION = /!(старт|стоп)/gi;

@Injectable()
export class BotService {
  public bot;
  private active = false;

  constructor(private vkApi: VkIoService) {
    this.bot = new VkBot({
      token: process.env.BOT_TOKEN,
      confirmation: process.env.CONFIRMATION,
    });

    this.onMessage = this.onMessage.bind(this);
    this.bot.on(this.onMessage);
  }

  private async onMessage(ctx) {
    if (ctx.message.text.match(START_STOP_ACTIVATION)) return this.onActivateControl(ctx);
    if (ctx.message.from_id == 408482064 && this.active) return this.onActivateBan(ctx);

    if (ctx.message.peer_id < 2000000000 || ctx.message.text.length > 33) return;

    if (ctx.message.text.match(SCHEDULE_ACTIVATION) ||
        ctx.message.text.match(WHAT_ACTIVATION) ||
        ctx.message.text.match(WHOM_ACTIVATION) ||
        ctx.message.text.match(AT_ACTIVATION)) await this.onActivate(ctx);
    else if (ctx.message.text.match(NEXT_ACTIVATION)) await this.onNext(ctx);
    else if (ctx.message.text.match(WHERE_AUDIENCE)) await this.onWhere(ctx);
  }

  async onActivateControl(ctx) {
    if (ctx.message.from_id == 152879324) {
      switch (ctx.message.text) {
        case '!старт':
          this.active = true;
          break;
        case '!стоп':
          this.active = false;
          break;
      }
      ctx.reply(`Пасхалка ${this.active ? 'включена' : 'отключена'}`);
    }
  }

  async onActivateBan(ctx) {
    await this.vkApi.api.messages.delete({
      peer_id: ctx.message.peer_id,
      conversation_message_ids: ctx.message.conversation_message_id,
      delete_for_all: true
    });
    ctx.reply("Влад соси хуй");
  }

  async onActivate(ctx) {
    const atDate = DateParser.Parse(ctx.message.text);
    const rasp = await DSTU.getRasp(atDate.date);
    ctx.reply(TextCompiler.Compile(rasp, atDate.mnemonic));
  }

  async onWhere(ctx) {
    const rasp = await DSTU.getRasp(new Date());
    const current = rasp.find(lesson => lesson.current);
    if (current) ctx.reply(TextCompiler.ShortInfo(current));
    else ctx.reply('Сейчас нет пар');
  }

  async onNext(ctx) {
    const rasp = await DSTU.getRasp(new Date());
    console.log(rasp);

    const currentIndex = rasp.findIndex(lesson => lesson.current);
    if (rasp[currentIndex + 1]) ctx.reply(TextCompiler.ShortInfo(rasp[currentIndex + 1]));
    else {
      if (rasp[currentIndex] && rasp[currentIndex].isStarted)
        ctx.reply('Это последняя пара');
      else if (rasp[currentIndex])
        ctx.reply(TextCompiler.ShortInfo(rasp[currentIndex]));
      else
        ctx.reply('Сегодня нет пар');
    }
  }
}
