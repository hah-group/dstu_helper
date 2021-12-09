import { BotJobBaseDataType } from './bot-job-base.data.type';
import { BotJobNamesEnum } from './bot-job-names.enum';

export type BotSendDataType = BotJobBaseDataType & {
  type: BotJobNamesEnum.SEND;
  text: string;
  to: number;
  keyboard?: string;
};
