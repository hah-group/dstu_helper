export class Keyboard {
  private data: VkKeyboard = {
    one_time: false,
    buttons: [],
    inline: false,
  };

  public buttons(data: VkButton[][]): Keyboard {
    this.data.buttons = data;
    return this;
  }

  public oneTime(): Keyboard {
    this.data.inline = false;
    this.data.one_time = true;
    return this;
  }

  public inline(): Keyboard {
    this.data.one_time = false;
    this.data.inline = true;
    return this;
  }

  public toJSON(): string {
    return JSON.stringify(this.data);
  }
}

export type VkKeyboard = VkStaticKeyboard | VkInlineKeyboard;

export interface VkStaticKeyboard {
  one_time: boolean;
  buttons: VkButton[][];
  inline: false;
}

export interface VkInlineKeyboard {
  one_time: false;
  buttons: VkButton[][];
  inline: true;
}

export type VkButton = VkTextButton | VkLinkButton | VkLocationButton | VkPayButton | VkCallbackButton;

export interface VkTextButton {
  action: {
    type: 'text';
    label: string;
    payload: string;
  };
  color: 'primary' | 'secondary' | 'negative' | 'positive';
}

export interface VkLinkButton {
  action: {
    type: 'open_link';
    label: string;
    payload: string;
    link: string;
  };
}

export interface VkLocationButton {
  action: {
    type: 'location';
    payload: string;
  };
}

export interface VkPayButton {
  action: {
    type: 'vkpay';
    payload: string;
    hash: string;
  };
}

export interface VkCallbackButton {
  action: {
    type: 'callback';
    label: string;
    payload: string;
  };
  color: 'primary' | 'secondary' | 'negative' | 'positive';
}
