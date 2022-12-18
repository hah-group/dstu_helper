import { Text } from '../text/text';

export interface BotExceptionParams {
  type: string;
  notifyScope: 'USER' | 'SYSTEM' | 'ALL';
  message: string;
  text: Text;
  data?: any;
}

export class BotException extends Error {
  public readonly type: string;
  public readonly text: Text;
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
