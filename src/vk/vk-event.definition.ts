import { EventType } from '../bot/metadata-type.enum';

export const VkEvent = {
  message_new: EventType.ON_MESSAGE,
  message_event: EventType.ON_INLINE_BUTTON,
};
