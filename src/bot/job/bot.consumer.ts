import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { BotSendDataType } from './bot-send.data.type';
import { BotService } from '../bot.service';
import { BotJobNamesEnum } from './bot-job-names.enum';
import { Logger } from '@nestjs/common';
import { BotReplyDataType } from './bot-reply.data.type';

@Processor('bot')
export class BotConsumer {
  private readonly log = new Logger('Bot Queue');
  constructor(private botService: BotService) {}

  @Process(BotJobNamesEnum.SEND)
  public async send(job: Job<BotSendDataType>): Promise<void> {
    const data = job.data;
    this.log.debug(`Sending message to: ${data.to}`);
    await this.sendMessage({
      peer_id: data.to,
      message: data.text,
    });
  }

  @Process(BotJobNamesEnum.REPLY)
  public async reply(job: Job<BotReplyDataType>): Promise<void> {
    const data = job.data;
    this.log.debug(`Reply from ${data.from} message to: ${data.to}`);
    await this.sendMessage({
      peer_id: data.to,
      message: data.text,
      forward: JSON.stringify({
        peer_id: data.to,
        conversation_message_ids: data.from,
        is_reply: true,
      }),
    });
  }

  private async sendMessage(params: any): Promise<void> {
    try {
      const messageResponse = await this.botService.execute('messages.send', {
        random_id: new Date().getTime(),
        ...params,
      });
      this.log.debug(`Message send success (message_id: ${messageResponse.message_id})`);
    } catch (e) {
      this.log.error(`Message sending fall`);
      console.error(e);
    }
  }
}
