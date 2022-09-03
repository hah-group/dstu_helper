import { MessageJobName } from '../../bot/type/message-job-name.enum';

export type TelegramJobData = TelegramJobSend | TelegramJobEdit | TelegramJobAlert;

export interface TelegramJobSend {
  type: MessageJobName.SEND;
  chatId: number;
  text: string;
  keyboard?: string;
}

export interface TelegramJobEdit {
  type: MessageJobName.EDIT;
  chatId: number;
  messageId: number;
  text: string;
  keyboard?: string;
}

export interface TelegramJobAlert {
  type: MessageJobName.ALERT;
  callbackId: string;
  text: string;
  force: boolean;
}
