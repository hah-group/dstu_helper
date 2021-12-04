import { Controller, Post, Request, Response } from '@nestjs/common';
import { BotService } from './bot.service';
import { OnMessage } from './decorator/on-message.decorator';
import { BotMessage } from './type/bot-message.type';
import { BotResponse } from './type/bot-response.type';

@Controller('bot')
export class BotController {
  constructor(private botService: BotService) {}

  @OnMessage('/test')
  public test(message: BotMessage): BotResponse {
    console.log(message);
    return {
      text: 'With reply',
      reply: true,
    };
  }
}
