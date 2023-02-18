import { MessageJobName } from '@dstu_helper/common';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { UserEntity } from '../../../modules/user/user.entity';
import { VkService } from '../vk.service';
import { VkJobAlert, VkJobEdit, VkJobGetUser, VkJobSend } from './vk-job-data.type';

@Processor('vk')
export class VkConsumer {
  private readonly log = new Logger('VKQueue');

  constructor(private readonly vkService: VkService) {}

  @Process(MessageJobName.SEND)
  public async send(job: Job<VkJobSend>): Promise<number | undefined> {
    this.log.debug(`Execute send job`);
    const { data } = job;
    return await this.vkService.sendMessage(data.chatId, data.message, data.keyboard);
  }

  @Process(MessageJobName.EDIT)
  public async edit(job: Job<VkJobEdit>): Promise<void> {
    this.log.debug(`Execute edit job`);
    const { data } = job;
    await this.vkService.editMessage(data.chatId, data.messageId, data.text, data.keyboard, data.eventParams);
  }

  @Process(MessageJobName.ALERT)
  public async alert(job: Job<VkJobAlert>): Promise<void> {
    this.log.debug(`Execute alert job`);
    const { data } = job;

    await this.vkService.sendAlert(data.chatId, data.fromId, data.eventId, data.text);
  }

  @Process(MessageJobName.GET_USER)
  public async getUser(job: Job<VkJobGetUser>): Promise<UserEntity> {
    this.log.debug(`Execute get user request job`);
    const { data } = job;

    return this.vkService.getUser(data.userId);
  }
}
