import { EventType } from '../bot/type/metadata-type.enum';
import { User } from '../../modules/user/user.entity';

interface BaseVkMessageData {
  type: EventType;
}

export type VkMessageData = VkMessageNewData | VkMessageEventData | VkMessageInviteData;

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

export interface VkMessageInviteData extends BaseVkMessageData {
  type: EventType.ON_INVITE;
  user: User;
  invitedUser?: User;
  memberId: number;
  peerId: number;
  fromId: number;
  lastMessageId?: number;
}
