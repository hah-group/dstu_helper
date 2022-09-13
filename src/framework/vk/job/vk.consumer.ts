import { Process, Processor } from '@nestjs/bull';
import { MessageJobName } from '../../bot/type/message-job-name.enum';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { VkService } from '../vk.service';
import { VkJobAlert, VkJobEdit, VkJobGetUser, VkJobSend } from './vk-job-data.type';

@Processor('vk')
export class VkConsumer {
  private readonly log = new Logger('VKQueue');

  constructor(private readonly vkService: VkService) {}

  /*@Process(MessageJobName.SEND)
  public async send(job: Job<VkJobSend>): Promise<number | undefined> {
    this.log.debug(`Execute send job`);
    const { data } = job;
    return this.vkService.sendMessage(data.peerId, data.text, data.keyboard);
  }

  @Process(MessageJobName.EDIT)
  public async edit(job: Job<VkJobEdit>): Promise<void> {
    this.log.debug(`Execute edit job`);
    const { data } = job;
    await this.vkService.editMessage(data);
  }

  @Process(MessageJobName.ALERT)
  public async alert(job: Job<VkJobAlert>): Promise<void> {
    this.log.debug(`Execute alert job`);
    const { data } = job;

    await this.vkService.alertEvent(data);
  }

  @Process('GET_USER')
  public async injectUser(job: Job<VkJobGetUser>): Promise<{ firstName: string; lastName: string } | undefined> {
    this.log.debug(`Execute get user request job`);
    const { data } = job;

    return this.vkService.getApiUser(data.userId);
  }*/
}
