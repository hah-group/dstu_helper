import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { SocialSource } from '../../../../../libs/bot/src/type/social.enum';
import { BotException } from './bot.exception';

export interface BotExceptionHandlerParams {
  exception: BotException;
  sendCallback: (text: string) => Promise<void>;
  social: SocialSource;
  user: string;
  locale: string;
}

@Injectable()
export class BotExceptionHandler {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  /* public async isValid(params: BotExceptionHandlerParams): Promise<void> {
    const { exception, sendCallback, social, user, locale } = params;

    if (exception.notifyScope == 'SYSTEM' || exception.notifyScope == 'ALL')
      this.eventEmitter.emit(InternalEvent.SYSTEM_NOTIFICATION, {
        error: exception,
        social: social,
        user: user,
      });

    if (exception.notifyScope == 'USER' || exception.notifyScope == 'ALL') {
      const localizeParams = exception.localizeMessage;
      const localizedMessage = localization(localizeParams.phrase, locale, localizeParams.replacements);
      await sendCallback(localizedMessage);
    }
  }*/
}
