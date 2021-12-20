import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { MessageJobName } from '../../bot/message-job-name.enum';
import { VkJobAlert, VkJobData, VkJobEdit, VkJobGetUser, VkJobSend } from './vk-job-data.type';

@Injectable()
export class VkProducer {
  private readonly log = new Logger('VkProducer');

  constructor(@InjectQueue('vk') private readonly queue: Queue<VkJobData>) {}

  public async send(data: Omit<VkJobSend, 'type'>): Promise<Job<VkJobData>> {
    this.log.debug(`Add send action to queue`);
    return this.queue.add(MessageJobName.SEND, {
      type: MessageJobName.SEND,
      ...data,
    });
  }

  public async edit(data: Omit<VkJobEdit, 'type'>): Promise<Job<VkJobData>> {
    this.log.debug(`Add edit action to queue`);
    return this.queue.add(MessageJobName.EDIT, {
      type: MessageJobName.EDIT,
      ...data,
    });
  }

  public async alert(data: Omit<VkJobAlert, 'type'>): Promise<Job<VkJobData>> {
    this.log.debug(`Add alert action to queue`);
    return this.queue.add(MessageJobName.ALERT, {
      type: MessageJobName.ALERT,
      ...data,
    });
  }

  public async getUser(data: Omit<VkJobGetUser, 'type'>): Promise<Job<VkJobData>> {
    this.log.debug(`Add get user request to queue`);
    return this.queue.add('GET_USER', {
      type: 'GET_USER',
      ...data,
    });
  }
}
