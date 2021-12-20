import { EventType } from '../bot/metadata-type.enum';
import { User } from '../user/user.entity';

interface BaseVkMessageData {
  type: EventType;
}

export type VkMessageData = VkMessageNewData | VkMessageEventData;

export interface VkMessageNewData extends BaseVkMessageData {
  type: EventType.ON_MESSAGE;
  peerId: number;
  fromId: number;
  user: User;
  text: string;
  lastMessageId?: number;
}

export interface VkMessageEventData extends BaseVkMessageData {
  type: EventType.ON_INLINE_BUTTON;
  user: User;
  peerId: number;
  fromId: number;
  eventId: string;
  payload: any;
  lastMessageId: number;
}
