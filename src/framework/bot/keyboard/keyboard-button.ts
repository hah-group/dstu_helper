import { Text } from '../../text/text';

export type KeyboardPayload = Record<string, any> & {
  text: string;
  id?: string;
};

export abstract class KeyboardButton {
  protected label: Text;
  protected _id?: string;

  protected constructor(label: Text, id?: string) {
    this.label = label;
    this._id = id;
  }

  public get id(): string {
    return this._id || this.label.render();
  }

  public abstract getPayload(): KeyboardPayload;
}
