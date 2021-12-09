import { Injectable } from '@nestjs/common';
import { OnMessage } from './decorator/on-message.decorator';
import { BotResponse } from './type/bot-response.type';
import { BUTTON_CHECK_ADMIN, CheckAdminKeyboard } from '../util/keyboard/check-admin.keyboard';
import { OnPayload } from './decorator/on-payload.decorator';
import { BotService } from './bot.service';
import { BotMessage } from './type/bot-message.type';

@Injectable()
export class LkHandler {
  constructor(private readonly botService: BotService) {}
  @OnMessage('/start', 'private')
  @OnMessage('/старт', 'private')
  public async firstStart(): Promise<BotResponse> {
    return {
      type: 'text',
      text: 'Дай админку',
      keyboard: CheckAdminKeyboard(2000000001),
    };
  }

  @OnPayload(BUTTON_CHECK_ADMIN)
  public async checkAdmin(message: BotMessage): Promise<BotResponse> {
    const result = await this.botService.isAdminInConversation(message.payload.conversationId);
    return {
      type: 'event',
      text: result ? 'Ура админка' : 'Нет админки((',
    };
  }
}
