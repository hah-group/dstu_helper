type ButtonColor = 'primary' | 'secondary' | 'negative' | 'positive';

export abstract class KeyboardButton {
  protected label: string;
  protected _id?: string;
  protected _payload?: any;
  protected _color?: ButtonColor;

  protected constructor(label: string, id?: string, payload?: any) {
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

  public abstract toVkObject(inlineMode: boolean): any;

  public abstract toTelegramObject(): any;
}
