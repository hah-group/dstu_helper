import { MessageJobName } from '../../bot/type/message-job-name.enum';

export type VkJobData = VkJobSend | VkJobEdit | VkJobAlert | VkJobGetUser;

export interface VkJobSend {
  type: MessageJobName.SEND;
  peerId: number;
  text: string;
  keyboard?: string;
}

export interface VkJobEdit {
  type: MessageJobName.EDIT;
  peerId: number;
  fromId: number;
  messageId: number;
  isConversation: boolean;
  text: string;
  keyboard?: string;
  eventId?: string;
}

export interface VkJobAlert {
  type: MessageJobName.ALERT;
  peerId: number;
  eventId: string;
  fromId: number;
  text?: string;
}

export interface VkJobGetUser {
  type: 'GET_USER';
  userId: number;
}
