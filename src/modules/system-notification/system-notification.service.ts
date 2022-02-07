import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InternalEvent } from '../util/internal-event.enum';
import { SocialSource } from '../bot/type/social.enum';
import { TelegramService } from 'src/modules/telegram/telegram.service';
import { KeyboardBuilder } from '../bot/keyboard/keyboard.builder';
import { LinkButton } from '../bot/keyboard/link.button';
import { Time } from '../util/time';
import { BotException } from '../bot-exception/bot.exception';

export interface SystemNotification {
  error: BotException;
  social: SocialSource;
  user?: string;
}

@Injectable()
export class SystemNotificationService {
  constructor(private readonly telegramService: TelegramService) {}

  @OnEvent(InternalEvent.SYSTEM_NOTIFICATION)
  public async sendNotification(params: SystemNotification): Promise<void> {
    const { social, error, user } = params;
    const userLink = user
      ? `${social == SocialSource.TELEGRAM ? 'https://t.me/' : 'https://vk.com/id'}${user}`
      : undefined;

    let keyboard;
    if (userLink)
      keyboard = new KeyboardBuilder()
        .add(
          new LinkButton(
            {
              phrase: 'Написать юзеру',
            },
            userLink,
          ),
        )
        .inline()
        .toJSON(SocialSource.TELEGRAM, 'ru');

    await this.telegramService.sendMessage(
      parseInt(process.env.SYSTEM_NOTIFICATION_TG_USER),
      `${Time.get().format('DD.MM.YYYY HH:mm:ss.SSS Z')}
<b>${error.type}</b>
<b>${error.message}</b>

<code>${error.stack}</code>


${
  error.data
    ? `<b>Error data:</b>
<code>${JSON.stringify(error.data, undefined, 2)}</code>`
    : ''
}`,
      keyboard,
    );
  }
}
