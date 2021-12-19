import { BotJobNamesEnum } from './bot-job-names.enum';
import { BotSendDataType } from './bot-send.data.type';

export interface BotEditDataType extends Omit<BotSendDataType, 'type'> {
  type: BotJobNamesEnum.EDIT;
  message_id: number;
  conversation_message_id: number;
}
