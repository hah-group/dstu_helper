import { Controller, Post, Request, Response } from '@nestjs/common';
import { BotService } from './bot.service';
import { OnMessage } from './decorator/on-message.decorator';
import { BotMessage } from './type/bot-message.type';
import { BotResponse } from './type/bot-response.type';
import { OnInvite } from './decorator/on-invite.decorator';
import { OnKick } from './decorator/on-kick.decorator';
import Markup from 'node-vk-bot-api/lib/markup';
import { Keyboard } from './bot.keyboard';
import { BotLinkKeyboard } from '../util/keyboard/bot-link.keyboard';
import { SetupHandler } from './setup.handler';

@Controller('bot')
export class BotController {
  constructor(private botService: BotService, private readonly setupHandler: SetupHandler) {}

  /*@OnMessage('/test')
  public async test2(message: BotMessage): Promise<BotResponse> {
    console.log(message);
    return this.setupHandler.addToConversation(message);
    /!*return {
      text: 'Hi',
      keyboard: BotLinkKeyboard,
    };*!/
  }*/

  @OnMessage('/test2')
  public test3(message: BotMessage): BotResponse {
    console.log(message);
    return {
      type: 'text',
      text: 'Without reply',
      reply: false,
    };
  }

  @OnInvite('iam')
  public test(message: BotMessage): BotResponse {
    console.log(message);
    return {
      type: 'text',
      text: 'Я ЖИВУ!',
    };
  }

  @OnInvite('user')
  public test1(message: BotMessage): BotResponse {
    console.log(message);
    return {
      type: 'text',
      text: 'Челепиздрик какой то',
    };
  }

  @OnKick()
  public kick(message: BotMessage): BotResponse {
    console.log(message);
    return {
      type: 'text',
      text: 'Пишов нахуй',
    };
  }
}
