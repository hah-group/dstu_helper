import { BotExceptionType } from './exception/bot-exception-type.enum';

export interface BotExceptionLocalizeMessage {
  phrase: string;
  replacements?: {
    [key: string]: string;
  };
}

export interface BotExceptionParams {
  type: BotExceptionType;
  notifyScope: 'USER' | 'SYSTEM' | 'ALL';
  message: string;
  localizeMessage: BotExceptionLocalizeMessage;
  data?: any;
}

export class BotException extends Error {
  public readonly type: BotExceptionType;
  public readonly localizeMessage: BotExceptionLocalizeMessage;
  public readonly notifyScope: 'USER' | 'SYSTEM' | 'ALL';
  public readonly data?: any;

  constructor(params: BotExceptionParams) {
    const { data, message, notifyScope, type, localizeMessage } = params;
    super(message);
    this.type = type;
    this.notifyScope = notifyScope;
    this.data = data;
    this.localizeMessage = localizeMessage;
  }
}
