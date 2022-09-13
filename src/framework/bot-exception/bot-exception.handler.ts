import { BotException } from './bot.exception';
import { SocialSource } from '../bot/type/social.enum';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InternalEvent } from '../../old_modules/util/internal-event.enum';
import { localization } from '../../old_modules/util/localization';

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

  public async handle(params: BotExceptionHandlerParams): Promise<void> {
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
  }
}
