import { BotJobBaseDataType } from './bot-job-base.data.type';
import { BotJobNamesEnum } from './bot-job-names.enum';

export type BotReplyDataType = BotJobBaseDataType & {
  type: BotJobNamesEnum.REPLY;
  text: string;
  to: number;
  from: number;
};
