import { MessageJobName } from '@dstu_helper/common';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

import { TelegramService } from '../telegram.service';
import { TelegramJobAlert, TelegramJobEdit, TelegramJobSend } from './telegram-job-data.type';

@Processor('telegram')
export class TelegramConsumer {
  private readonly log = new Logger('TelegramQueue');

  constructor(private readonly telegramService: TelegramService) {}

  @Process(MessageJobName.SEND)
  public async send(job: Job<TelegramJobSend>): Promise<number> {
    const data = job.data;
    return this.telegramService.sendMessage(data.chatId, data.message, data.options);
  }

  @Process(MessageJobName.EDIT)
  public async edit(job: Job<TelegramJobEdit>): Promise<void> {
    this.log.debug(`Execute edit job to ${job.data.chatId}`);
    const { data } = job;
    try {
      return this.telegramService.editMessage(data.chatId, data.messageId, data.text, data.keyboard);
    } catch (e) {
      console.error(e);
    }
  }

  @Process(MessageJobName.ALERT)
  public async alert(job: Job<TelegramJobAlert>): Promise<void> {
    this.log.debug(`Execute alert job`);
    const { data } = job;
    return this.telegramService.sendAlert(data.eventId, data.text);
  }
}
