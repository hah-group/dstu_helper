import { BotJobNamesEnum } from './bot-job-names.enum';
import { BotSendDataType } from './bot-send.data.type';
import { BotReplyDataType } from './bot-reply.data.type';
import { BotEventDataType } from './bot-event.data.type';

export type BotJobBaseDataType = {
  type: BotJobNamesEnum;
};

export type BotJobDataType = BotSendDataType | BotReplyDataType | BotEventDataType;
