import { Text } from '../../text/text';

export type KeyboardPayload = Record<string, any> & {
  text: string;
  id?: string;
};

export abstract class KeyboardButton {
  public readonly type: string;
  protected label: Text;

  protected constructor(type: string, label: Text, id?: string) {
    this.label = label;
    this._id = id;
    this.type = type;
  }

  protected _id?: string;

  public get id(): string {
    return this._id || this.label.render();
  }

  public abstract getPayload(): KeyboardPayload;
}
