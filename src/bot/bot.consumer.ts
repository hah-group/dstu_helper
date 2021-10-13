import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { BotSendDataType } from './bot-send.data.type';
import { BotService } from './bot.service';
import { BotJobNamesEnum } from './bot-job-names.enum';

@Processor('bot')
export class BotConsumer {
  constructor(private botService: BotService) {}

  @Process(BotJobNamesEnum.SEND)
  async send(job: Job<BotSendDataType>) {
    const data = job.data;
    await this.botService.bot.sendMessage(data.ctx.message.peer_id, data.text);
  }
}
