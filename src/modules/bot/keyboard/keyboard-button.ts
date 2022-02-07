import { ProcessedTextInstance, TextProcessor } from '../../util/text.processor';

type ButtonColor = 'primary' | 'secondary' | 'negative' | 'positive';

export abstract class KeyboardButton {
  protected label: ProcessedTextInstance;
  protected _id?: string;
  protected _payload?: any;
  protected _color?: ButtonColor;

  protected constructor(label: ProcessedTextInstance, id?: string, payload?: any) {
    this.label = label;
    this._id = id;
    this._payload = payload;
  }

  public id(value: string): KeyboardButton {
    this._id = value;
    return this;
  }

  public payload(value: any): KeyboardButton {
    this._payload = value;
    return this;
  }

  public color(value: ButtonColor): KeyboardButton {
    this._color = value;
    return this;
  }

  public localize(processedText: ProcessedTextInstance, locale: string): string {
    return TextProcessor.buildText([processedText], locale);
  }

  public abstract toVkObject(locale: string, inlineMode: boolean): any;

  public abstract toTelegramObject(locale: string): any;
}
