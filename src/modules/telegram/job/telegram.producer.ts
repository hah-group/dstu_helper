import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { TelegramJobAlert, TelegramJobData, TelegramJobEdit, TelegramJobSend } from './telegram-job-data.type';
import { MessageJobName } from '../../bot/type/message-job-name.enum';

@Injectable()
export class TelegramProducer {
  private readonly log = new Logger('TelegramQueue');

  constructor(@InjectQueue('telegram') private readonly queue: Queue<TelegramJobData>) {}

  public async send(data: Omit<TelegramJobSend, 'type'>): Promise<Job<TelegramJobData>> {
    this.log.debug(`Add send action to queue`);
    return this.queue.add(MessageJobName.SEND, {
      type: MessageJobName.SEND,
      ...data,
    });
  }

  public async edit(data: Omit<TelegramJobEdit, 'type'>): Promise<Job<TelegramJobData>> {
    this.log.debug(`Add edit action to queue`);
    return this.queue.add(MessageJobName.EDIT, {
      type: MessageJobName.EDIT,
      ...data,
    });
  }

  public async alert(data: Omit<TelegramJobAlert, 'type'>): Promise<Job<TelegramJobData>> {
    this.log.debug(`Add alert action to queue`);
    return this.queue.add(MessageJobName.ALERT, {
      type: MessageJobName.ALERT,
      ...data,
    });
  }
}
