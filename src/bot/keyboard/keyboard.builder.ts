import { KeyboardButton } from './keyboard-button';
import { SocialSource } from '../social.enum';

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

  public toJSON(social: SocialSource): string {
    switch (social) {
      case SocialSource.VK:
        return JSON.stringify(this.toVkObject(), undefined, 2);
      case SocialSource.TELEGRAM:
        return JSON.stringify(this.toTelegramObject(), undefined, 2);
    }
  }

  private toTelegramObject(): any {
    const buttons = this.keyboard.map((row) => row.map((button) => button.toTelegramObject()));
    if (this._inline) {
      return {
        inline_keyboard: buttons,
      };
    } else {
      return {
        keyboard: buttons,
        one_time_keyboard: this._oneTime,
        resize_keyboard: true,
      };
    }
  }

  private toVkObject(): any {
    const buttons = this.keyboard.map((row) => row.map((button) => button.toVkObject(this._inline)));
    return {
      one_time: this._oneTime,
      buttons: buttons,
      inline: this._inline,
    };
  }
}
