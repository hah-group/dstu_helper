import { Injectable } from '@nestjs/common';
import { OnMessage } from './decorator/on-message.decorator';
import { BotResponse } from './type/bot-response.type';
import { INLINE_BUTTON_CHECK_ADMIN, CheckAdminKeyboard } from '../util/keyboard/check-admin.keyboard';
import { OnPayload } from './decorator/on-payload.decorator';
import { BotService } from './bot.service';
import { BotMessage } from './type/bot-message.type';

@Injectable()
export class LkHandler {
  constructor(private readonly botService: BotService) {}
  @OnMessage(['/start', '/старт'], 'private')
  public async firstStart(): Promise<BotResponse> {
    return {
      type: 'message',
      text: 'Дай админку',
      keyboard: CheckAdminKeyboard(2000000001),
    };
  }

  public async newConversation(conversationId: number): Promise<BotResponse> {
    return {
      type: 'message',
      text: `Дай админку для `,
      keyboard: CheckAdminKeyboard(conversationId),
    };
  }
}
