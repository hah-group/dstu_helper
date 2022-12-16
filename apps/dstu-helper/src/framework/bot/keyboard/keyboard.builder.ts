import { KeyboardButton } from './keyboard-button';

export class KeyboardBuilder {
  private keyboard: KeyboardButton[][] = [];
  private _row = 0;
  private _inline = false;
  private _oneTime = false;

  public add(button: KeyboardButton): KeyboardBuilder {
    const row = this.keyboard[this._row];
    if (!row) this.keyboard[this._row] = [];
    this.keyboard[this._row].push(button);
    return this;
  }

  public row(): KeyboardBuilder {
    this._row += 1;
    return this;
  }

  public inline(): KeyboardBuilder {
    this._inline = true;
    return this;
  }

  public oneTime(): KeyboardBuilder {
    this._oneTime = true;
    return this;
  }

  public isEmpty(): boolean {
    return this.keyboard.length == 0;
  }

  public isInline(): boolean {
    return this._inline;
  }

  public isOneTime(): boolean {
    return this._oneTime;
  }

  public getKeys(): KeyboardButton[][] {
    return this.keyboard;
  }
}
