import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { BotSendDataType } from './bot-send.data.type';
import { BotService } from '../bot.service';
import { BotJobNamesEnum } from './bot-job-names.enum';
import { Logger } from '@nestjs/common';
import { BotReplyDataType } from './bot-reply.data.type';
import { BotEventDataType } from './bot-event.data.type';
import { VkIoService } from '../../vk-io/vk-io.service';
import { VkSendMessageResponse } from '../type/vk-send-message-response.type';
import { BotEditDataType } from './bot-edit.data.type';

@Processor('bot')
export class BotConsumer {
  private readonly log = new Logger('Bot Queue');
  constructor(private botService: BotService, private readonly vkIoService: VkIoService) {}

  @Process(BotJobNamesEnum.SEND)
  public async send(job: Job<BotSendDataType>): Promise<VkSendMessageResponse> {
    const data = job.data;
    this.log.debug(`Sending message to: ${data.to}`);
    return this.sendMessage({
      peer_ids: data.to,
      message: data.text,
      keyboard: data.keyboard,
    });
  }

  @Process(BotJobNamesEnum.REPLY)
  public async reply(job: Job<BotReplyDataType>): Promise<VkSendMessageResponse> {
    const data = job.data;
    this.log.debug(`Reply from ${data.from} message to: ${data.to}`);
    return this.sendMessage({
      peer_ids: data.to,
      message: data.text,
      forward: JSON.stringify({
        peer_id: data.to,
        conversation_message_ids: data.from,
        is_reply: true,
      }),
    });
  }

  @Process(BotJobNamesEnum.EVENT)
  public async event(job: Job<BotEventDataType>): Promise<void> {
    const data = job.data;
    this.log.debug(`Event to ${data.peerId}`);
    await this.botService.execute('messages.sendMessageEventAnswer', {
      event_id: data.eventId,
      user_id: data.userId,
      peer_id: data.peerId,
      event_data: JSON.stringify({
        type: 'show_snackbar',
        text: data.text,
      }),
    });
  }

  @Process(BotJobNamesEnum.EDIT)
  public async edit(job: Job<BotEditDataType>): Promise<void> {
    const data = job.data;
    this.log.debug(`Edit message ${data.message_id || data.conversation_message_id} in conversation ${data.to}`);
    await this.botService.execute('messages.edit', {
      peer_id: data.to,
      message: data.text,
      keyboard: data.keyboard,
      ...(data.message_id > 0
        ? { message_id: data.message_id }
        : { conversation_message_id: data.conversation_message_id }),
    });
  }

  private async sendMessage(params: any): Promise<VkSendMessageResponse> {
    try {
      const messageResponse = await this.vkIoService.api.messages.send({
        random_id: new Date().getTime(),
        ...params,
      });
      const messageData = messageResponse[0];
      const messageId = messageData.message_id || messageData.conversation_message_id;
      this.log.debug(`Message send success (message_id: ${messageId})`);
      return messageData;
    } catch (e) {
      this.log.error(`Message sending fall`);
      console.error(e);
    }
  }
}
