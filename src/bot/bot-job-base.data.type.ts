import { BotJobNamesEnum } from './bot-job-names.enum';
import { BotSendDataType } from './bot-send.data.type';

export type BotJobBaseDataType = {
  type: BotJobNamesEnum;
};

export type BotJobDataType = BotSendDataType;
