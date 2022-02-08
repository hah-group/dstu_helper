import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
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
export class SystemNotificationService implements OnApplicationBootstrap {
  constructor(private readonly telegramService: TelegramService) {}

  private static formatText(text: string): string {
    let htmlText = text.replace(/</gi, '&lt;');
    htmlText = htmlText.replace(/>/gi, '&gt;');
    htmlText = htmlText.replace(/&/gi, '&amp;');
    htmlText = htmlText.replace(/"/gi, '&quot;');
    return htmlText;
  }

  public async onApplicationBootstrap(): Promise<void> {
    if (process.env.FLAVOUR != 'prod') return;

    await this.telegramService.sendMessage(
      parseInt(process.env.SYSTEM_NOTIFICATION_TG_USER),
      `Application deployed with version: <code>${process.env.npm_package_version}</code>`,
    );
  }

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

    const text = `${Time.get().format('DD.MM.YYYY HH:mm:ss.SSS Z')}
<b>${error.type}</b>
<b>${SystemNotificationService.formatText(error.message)}</b>

${
  error.data
    ? `<b>Error data:</b>
<code>${SystemNotificationService.formatText(JSON.stringify(error.data, undefined, 2))}</code>`
    : ''
}`;
    await this.telegramService.sendMessage(parseInt(process.env.SYSTEM_NOTIFICATION_TG_USER), text, keyboard);
  }
}
