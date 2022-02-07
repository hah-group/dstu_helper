import { Process, Processor } from '@nestjs/bull';
import { MessageJobName } from '../../bot/type/message-job-name.enum';
import { TelegramService } from '../telegram.service';
import { TelegramJobAlert, TelegramJobEdit, TelegramJobSend } from './telegram-job-data.type';
import { Message as TelegramMessage } from 'node-telegram-bot-api';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';

@Processor('telegram')
export class TelegramConsumer {
  private readonly log = new Logger('TelegramQueue');

  constructor(private readonly telegramService: TelegramService) {}

  @Process(MessageJobName.SEND)
  public async send(job: Job<TelegramJobSend>): Promise<TelegramMessage> {
    this.log.debug(`Execute send job to ${job.data.chatId}`);
    const { data } = job;
    return this.telegramService.sendMessage(data.chatId, data.text, data.keyboard);
  }

  @Process(MessageJobName.EDIT)
  public async edit(job: Job<TelegramJobEdit>): Promise<TelegramMessage | undefined> {
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
    return this.telegramService.alertEvent(data.callbackId, data.text, data.force);
  }
}
