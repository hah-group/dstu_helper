import { BotJobBaseDataType } from './bot-job-base.data.type';
import { BotJobNamesEnum } from './bot-job-names.enum';

export type BotEventDataType = BotJobBaseDataType & {
  type: BotJobNamesEnum.EVENT;
  text: string;
  eventId: string;
  userId: number;
  peerId: number;
};
