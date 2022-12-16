import { MessageJobName } from '../../bot/type/message-job-name.enum';
import { TelegramKeyboard, TelegramSendOptions } from '../telegram.service';

export type TelegramJobData = TelegramJobSend | TelegramJobEdit | TelegramJobAlert;

export interface TelegramJobSend {
  type: MessageJobName.SEND;
  chatId: number;
  message: string;
  options: TelegramSendOptions;
}

export interface TelegramJobEdit {
  type: MessageJobName.EDIT;
  text?: string;
  keyboard?: TelegramKeyboard;
  chatId: number;
  messageId: number;
}

export interface TelegramJobAlert {
  type: MessageJobName.ALERT;
  eventId: string;
  text: string;
  show: boolean;
}
