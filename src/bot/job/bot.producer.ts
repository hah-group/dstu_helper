import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { BotSendDataType } from './bot-send.data.type';
import { BotJobDataType } from './bot-job-base.data.type';
import { BotJobNamesEnum } from './bot-job-names.enum';
import { BotReplyDataType } from './bot-reply.data.type';
import { BotEventDataType } from './bot-event.data.type';
import { BotEditDataType } from './bot-edit.data.type';

@Injectable()
export class BotProducer {
  constructor(@InjectQueue('bot') private sendQueue: Queue<BotJobDataType>) {}

  public async sendMessage(data: Omit<BotSendDataType, 'type'>): Promise<Job<BotJobDataType>> {
    return this.sendQueue.add(BotJobNamesEnum.SEND, {
      type: BotJobNamesEnum.SEND,
      ...data,
    });
  }

  public async reply(data: Omit<BotReplyDataType, 'type'>): Promise<Job<BotJobDataType>> {
    return this.sendQueue.add(BotJobNamesEnum.REPLY, {
      type: BotJobNamesEnum.REPLY,
      ...data,
    });
  }

  public async sendEvent(data: Omit<BotEventDataType, 'type'>): Promise<void> {
    await this.sendQueue.add(BotJobNamesEnum.EVENT, {
      type: BotJobNamesEnum.EVENT,
      ...data,
    });
  }

  public async edit(data: Omit<BotEditDataType, 'type'>): Promise<void> {
    await this.sendQueue.add(BotJobNamesEnum.EDIT, {
      type: BotJobNamesEnum.EDIT,
      ...data,
    });
  }
}
