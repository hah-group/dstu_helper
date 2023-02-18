import { KeyboardBuilder } from '@dstu_helper/common';

import {
  TelegramInlineKeyboard,
  TelegramKeyboard,
  TelegramRemoveKeyboard,
  TelegramReplyKeyboard,
} from './telegram.service';

export class TelegramKeyboardBuilder {
  public static Build(keyboard: KeyboardBuilder, forceInline: boolean): TelegramKeyboard {
    if (keyboard.isEmpty()) return this.BuildRemove(keyboard);
    else if (forceInline || keyboard.isInline()) return this.BuildInline(keyboard);
    else return this.BuildReply(keyboard);
  }

  private static BuildReply(keyboard: KeyboardBuilder): TelegramReplyKeyboard {
    return {
      keyboard: keyboard.getKeys().map((row) =>
        row.map((button) => {
          const { text } = button.getPayload();
          return {
            text: text,
          };
        }),
      ),
      one_time_keyboard: keyboard.isOneTime(),
      resize_keyboard: true,
    };
  }

  private static BuildInline(keyboard: KeyboardBuilder): TelegramInlineKeyboard {
    return {
      inline_keyboard: keyboard.getKeys().map((row) =>
        row.map((button) => {
          const { text, id, ...payload } = button.getPayload();
          return {
            text: text,
            callback_data: id,
            url: payload['link'],
          };
        }),
      ),
    };
  }

  private static BuildRemove(keyboard: KeyboardBuilder): TelegramRemoveKeyboard | any {
    if (!keyboard.isInline()) {
      return {
        remove_keyboard: true,
      };
    } else {
      return {};
    }
  }
}
