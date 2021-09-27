import { Injectable } from '@nestjs/common';
import {DateParser} from "../util/DateParser";
import DSTU from "../DSTU/DSTU";
import {TextCompiler} from "../util/TextCompiler";

const VkBot = require('node-vk-bot-api');

export const SCHEDULE_ACTIVATION = /расписание( пар)?.*/ig;
export const WHAT_ACTIVATION = /(что|чо|шо|че|чё) (?!на завтра)(на |у нас завтра|по парам).*/ig;
export const WHOM_ACTIVATION = /(.*какие .*?(пары).*|пары.*?какие)/ig;
export const AT_ACTIVATION = /пары (на|в|во).*/ig;

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
    if (ctx.message.peer_id < 2000000000 || ctx.message.text.length > 33) return;

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
}
