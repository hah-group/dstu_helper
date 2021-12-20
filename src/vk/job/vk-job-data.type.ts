import { MessageJobName } from '../../bot/message-job-name.enum';

export type VkJobData = VkJobSend | VkJobEdit | VkJobAlert;

export interface VkJobSend {
  type: MessageJobName.SEND;
  peerId: number;
  text: string;
  keyboard?: string;
}

export interface VkJobEdit {
  type: MessageJobName.EDIT;
  peerId: number;
  messageId: number;
  isConversation: boolean;
  text: string;
  keyboard?: string;
}

export interface VkJobAlert {
  type: MessageJobName.ALERT;
  peerId: number;
  eventId: string;
  fromId: number;
  text: string;
}
