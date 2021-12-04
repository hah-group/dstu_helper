import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { BotSendDataType } from './bot-send.data.type';
import { BotJobDataType } from './bot-job-base.data.type';
import { BotJobNamesEnum } from './bot-job-names.enum';
import { BotReplyDataType } from './bot-reply.data.type';

@Injectable()
export class BotProducer {
  constructor(@InjectQueue('bot') private sendQueue: Queue<BotJobDataType>) {}

  public async sendMessage(data: Omit<BotSendDataType, 'type'>) {
    await this.sendQueue.add(BotJobNamesEnum.SEND, {
      type: BotJobNamesEnum.SEND,
      ...data,
    });
  }

  public async reply(data: Omit<BotReplyDataType, 'type'>) {
    await this.sendQueue.add(BotJobNamesEnum.REPLY, {
      type: BotJobNamesEnum.SEND,
      ...data,
    });
  }
}
