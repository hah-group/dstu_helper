import { KeyboardBuilder } from '@dstu_helper/common';

export class VkKeyboardBuilder {
  public static Build(keyboard: KeyboardBuilder, forceInline: boolean): any {
    if (keyboard.isEmpty()) return this.BuildRemove();
    else if (forceInline || keyboard.isInline()) return this.BuildInline(keyboard);
    else return this.BuildReply(keyboard);
  }

  private static BuildReply(keyboard: KeyboardBuilder): any {
    return {
      buttons: keyboard.getKeys().map((row) =>
        row.map((button) => {
          const { text, ...payload } = button.getPayload();
          return {
            action: {
              type: button.type,
              label: text,
              link: payload['link'],
            },
          };
        }),
      ),
      one_time: keyboard.isOneTime(),
      inline: false,
    };
  }

  private static BuildInline(keyboard: KeyboardBuilder): any {
    return {
      buttons: keyboard.getKeys().map((row) =>
        row.map((button) => {
          const { text, id } = button.getPayload();
          return {
            action: {
              type: 'callback',
              label: text,
              payload: JSON.stringify({ id }),
            },
          };
        }),
      ),
      inline: true,
    };
  }

  private static BuildRemove(): any {
    return { buttons: [], one_time: true };
  }
}
