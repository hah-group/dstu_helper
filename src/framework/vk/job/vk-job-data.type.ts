import { MessageJobName } from '../../bot/type/message-job-name.enum';
import { VKEditEventParams } from '../vk.service';

export type VkJobData = VkJobSend | VkJobEdit | VkJobAlert | VkJobGetUser;

export interface VkJobSend {
  type: MessageJobName.SEND;
  chatId: number;
  message: string;
  keyboard?: any;
}

export interface VkJobEdit {
  type: MessageJobName.EDIT;
  text: string;
  keyboard?: any;
  chatId: number;
  messageId: number;
  eventParams?: VKEditEventParams;
}

export interface VkJobAlert {
  type: MessageJobName.ALERT;
  chatId: number;
  fromId: number;
  eventId: string;
  text: string;
}

export interface VkJobGetUser {
  type: MessageJobName.GET_USER;
  userId: number;
}
