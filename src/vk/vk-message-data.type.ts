import { EventType } from '../bot/metadata-type.enum';

interface BaseVkMessageData {
  type: EventType;
}

export type VkMessageData = VkMessageNewData | VkMessageEventData;

export interface VkMessageNewData extends BaseVkMessageData {
  type: EventType.ON_MESSAGE;
  peerId: number;
  fromId: number;
  text: string;
  lastMessageId?: number;
}

export interface VkMessageEventData extends BaseVkMessageData {
  type: EventType.ON_INLINE_BUTTON;
  peerId: number;
  fromId: number;
  eventId: string;
  payload: any;
  lastMessageId: number;
}
