import { Content } from '../../../../../libs/common/src/content/content';

export interface BotExceptionParams {
  type: string;
  notifyScope: 'USER' | 'SYSTEM' | 'ALL';
  message: string;
  text: Content;
  data?: any;
}

export class BotException extends Error {
  public readonly type: string;
  public readonly text: Content;
  public readonly notifyScope: 'USER' | 'SYSTEM' | 'ALL';
  public readonly data?: any;

  constructor(params: BotExceptionParams) {
    const { data, message, notifyScope, type, text } = params;
    super(message);
    this.type = type;
    this.notifyScope = notifyScope;
    this.data = data;
    this.text = text;
  }
}
