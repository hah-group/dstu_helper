import { BotException } from '../bot.exception';
import { BotExceptionType } from './bot-exception-type.enum';

export class UnknownException extends BotException {
  constructor(exception: Error) {
    super({
      type: BotExceptionType.UNKNOWN,
      notifyScope: 'ALL',
      message: exception.message,
      localizeMessage: {
        phrase: 'EXCEPTION_UNKNOWN',
      },
      data: {
        stack: exception.stack,
      },
    });
  }
}
