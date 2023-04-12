import { Content } from '@dstu_helper/common';

export type KeyboardPayload = Record<string, any> & {
  text: string;
  id?: string;
};

export abstract class KeyboardButton {
  public readonly type: string;
  protected label: Content;

  protected constructor(type: string, label: Content, id?: string) {
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
