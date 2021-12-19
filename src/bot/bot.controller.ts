import { Controller } from '@nestjs/common';
import { BotService } from './bot.service';
import { OnMessage } from './decorator/on-message.decorator';
import { BotMessage } from './type/bot-message.type';
import { BotResponse } from './type/bot-response.type';
import { SetupHandler } from './setup.handler';
import { UniversityService } from 'src/university/university.service';
import { UniversityName } from '../university/university-name.enum';

@Controller('bot')
export class BotController {
  constructor(
    private botService: BotService,
    private readonly setupHandler: SetupHandler,
    private readonly universityService: UniversityService,
  ) {}

  @OnMessage('/long_process')
  public async test(message: BotMessage): Promise<BotResponse> {
    await message.placeholder('Думаю...');
    const promise = new Promise((resolve) => {
      setTimeout(resolve, 3000);
    });
    await promise;
    return {
      type: 'message',
      text: 'Подумал!',
    };
  }

  @OnMessage('/fetch_groups')
  public async groups(): Promise<void> {
    console.log(await this.universityService.findGroup('дебилы вкб23', UniversityName.DSTU));
  }

  /*@OnMessage('/test')
  public async test2(message: BotMessage): Promise<BotResponse> {
    console.log(message);
    //return this.setupHandler.addToConversation(message);
    /!*return {
      text: 'Hi',
      keyboard: BotLinkKeyboard,
    };*!/
  }*/

  /*@OnMessage('/test2')
  public test3(message: BotMessage): BotResponse {
    console.log(message);
    return {
      type: 'message',
      text: 'Without reply',
    };
  }

  @OnInvite('iam')
  public test(message: BotMessage): BotResponse {
    console.log(message);
    return {
      type: 'message',
      text: 'Я ЖИВУ!',
    };
  }

  @OnInvite('user')
  public test1(message: BotMessage): BotResponse {
    console.log(message);
    return {
      type: 'message',
      text: 'Челепиздрик какой то',
    };
  }

  @OnKick()
  public kick(message: BotMessage): BotResponse {
    console.log(message);
    return {
      type: 'message',
      text: 'Пишов нахуй',
    };
  }*/
}
