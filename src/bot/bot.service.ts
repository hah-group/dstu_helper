import { Injectable, Logger } from '@nestjs/common';
import { DateParser } from '../util/date.parser';

import VkBot from 'node-vk-bot-api';
import { VkBotContextType } from './type/vk-bot-context.type';
import { VkBotInterface } from './type/vk-bot.interface';
import { StudyGroupService } from '../study-group/study-group.service';
/*import {
  ADD_TO_GROUP,
  AT_ACTIVATION,
  NEXT_AUDIENCE,
  SCHEDULE_ACTIVATION,
  TextProcessor,
  WHAT_ACTIVATION,
  WHERE_AUDIENCE,
  WHOM_ACTIVATION,
} from '../util/text.processor';*/
import * as moment from 'moment';
import { TimeRelativeProcessor } from '../util/time-relative.processor';
import { BotProducer } from './job/bot.producer';
import { BotMessage } from './type/bot-message.type';
import { BotResponse } from './type/bot-response.type';
import { BotEvents } from './bot.events';
import { Keyboard } from 'vk-io';
import { VkIoService } from 'src/vk-io/vk-io.service';

const MENTION_PATTERN = new RegExp(/^\[club\d+\|[a-z\d@]+]/gi);

const CONVERSATION_START_ID = 2000000000;

@Injectable()
export class BotService extends VkBot {
  private readonly log = new Logger(BotService.name);
  public readonly events = new BotEvents();

  constructor(
    private scheduleService: StudyGroupService,
    private sendQueue: BotProducer,
    private groupService: StudyGroupService,
    private readonly vkIoService: VkIoService,
  ) {
    super({
      token: process.env.BOT_TOKEN,
      group_id: parseInt(process.env.GROUP_ID),
    });
    this.use((ctx, next) => {
      this.events.emit('event', ctx);
      next();
    });
    this.on((ctx) => this.events.emit('message', ctx));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.startPolling((err) => {
      if (err) {
        console.error(err);
      }
    });
  }

  /*private async onAddGroup(ctx) {
    const regex = new RegExp(ADD_TO_GROUP);
    const groupName = regex.exec(ctx.message.text);
    if (groupName[1]) {
      const group = await this.groupService.findGroup(groupName[1].toUpperCase());
      if (!group) return this.sendMessage(ctx, TextProcessor.SOURCE_NOT_FOUND_GROUP);

      this.log.log(`Adding a new student id${ctx.message.from_id} to the group ${group.name}`);
      await this.groupService.addUserToGroup(group, ctx.message.from_id);
      return this.sendMessage(ctx, TextProcessor.youAddInGroup(group.name));
    } else return this.sendMessage(ctx, TextProcessor.WRITE_GROUP_NAME);
  }

  private async onHelp(ctx) {
    return await this.sendMessage(ctx, TextProcessor.HELP);
  }

  private async onActivate(ctx) {
    const atDate = DateParser.Parse(ctx.message.text);
    try {
      const schedule = await this.scheduleService.studyGroup(ctx.message.from_id, atDate);
      if (schedule.updateStatus) return this.sendMessage(ctx, TextProcessor.SCHEDULE_UPDATING);
      return this.sendMessage(ctx, TextProcessor.Compile(schedule, atDate.toDate()));
    } catch {
      return this.sendMessage(ctx, TextProcessor.NOT_FOUND_GROUP);
    }
  }

  private async onWhere(ctx) {
    try {
      const schedule = await this.scheduleService.studyGroup(ctx.message.from_id, moment().startOf('d'));
      if (schedule.updateStatus) return this.sendMessage(ctx, TextProcessor.SCHEDULE_UPDATING);
      const current = schedule.Schedule.find((lesson, index) =>
        TimeRelativeProcessor.isNow(lesson, schedule.Schedule[index - 1]),
      );
      if (current) return this.sendMessage(ctx, TextProcessor.ShortInfo(current));
      else return this.sendMessage(ctx, TextProcessor.NOW_LESSON_NONE);
    } catch {
      return this.sendMessage(ctx, TextProcessor.NOT_FOUND_GROUP);
    }
  }

  private async onNext(ctx) {
    try {
      const schedule = await this.scheduleService.studyGroup(ctx.message.from_id, moment().startOf('d'));
      if (schedule.updateStatus) return this.sendMessage(ctx, TextProcessor.SCHEDULE_UPDATING);

      const nextIndex = schedule.Schedule.findIndex((lesson, index) =>
        TimeRelativeProcessor.isNext(lesson, schedule.Schedule[index - 1]),
      );

      if (nextIndex > -1) return this.sendMessage(ctx, TextProcessor.ShortInfo(schedule.Schedule[nextIndex]));
      else {
        if (schedule.Schedule.length > 0)
          return this.sendMessage(
            ctx,
            TimeRelativeProcessor.isEnded(schedule.Schedule[schedule.Schedule.length - 1])
              ? TextProcessor.LESSONS_ENDED
              : TextProcessor.LAST_LESSON,
          );
        else return this.sendMessage(ctx, TextProcessor.TODAY_LESSON_NONE);
      }
    } catch {
      return this.sendMessage(ctx, TextProcessor.NOT_FOUND_GROUP);
    }
  }*/

  public addMessageHandler(
    callback: (message: BotMessage) => Promise<BotResponse> | BotResponse,
    event?: string | RegExp,
    scope?: 'conversation' | 'private' | 'all',
  ): void {
    this.events.on('message', async (ctx) => {
      if (ctx.message.type !== 'message_new') return;

      const { message } = ctx;
      let messageText = message.text;
      if (!messageText) return;

      this.log.debug(`Handled message peer_id: ${message.peer_id}`);

      this.log.debug(`Checking scopes (Handler scope: ${scope})`);
      const isConversation = message.peer_id >= CONVERSATION_START_ID;

      this.log.debug(`Event from conversation: ${isConversation}`);
      if (scope == 'conversation' && !isConversation) return;
      else if (scope == 'private' && isConversation) return;

      const isMentioned = !!message.text.match(MENTION_PATTERN);

      messageText = messageText.replace(MENTION_PATTERN, '');
      messageText = messageText.trim();

      let pattern;
      if (typeof event === 'string') pattern = new RegExp(`^${event}$`, 'gi');
      else pattern = new RegExp(event);

      if (messageText.match(pattern)) {
        const response: BotResponse | undefined = await callback({
          ...message,
          text: messageText,
          isMentioned,
          isConversation,
          isButton: false,
        });
        if (response) await this.responseHandler(response, ctx);
      }
    });
  }

  public addInviteHandler(
    callback: (message: BotMessage) => Promise<BotResponse> | BotResponse,
    scope: 'user' | 'iam',
  ): void {
    this.events.on('event', async (ctx) => {
      if (ctx.message.type !== 'message_new') return;

      if (!ctx.message.action || ctx.message.action.type != 'chat_invite_user') return;
      if (ctx.message.action.member_id) {
        if (scope == 'user' && ctx.message.action.member_id < 0) return;
        else if (scope == 'iam' && ctx.message.action.member_id != parseInt(process.env.GROUP_ID) * -1) return;
      }
      const response: BotResponse | undefined = await callback({
        ...ctx.message,
        isMentioned: false,
        isConversation: true,
        isButton: false,
      });

      if (response) await this.responseHandler(response, ctx);
    });
  }

  public addKickHandler(callback: (message: BotMessage) => Promise<BotResponse> | BotResponse): void {
    this.events.on('event', async (ctx) => {
      if (ctx.message.type !== 'message_new') return;

      if (!ctx.message.action || ctx.message.action.type != 'chat_kick_user') return;
      if (ctx.message.action.member_id && ctx.message.action.member_id < 0) return;

      const response: BotResponse | undefined = await callback({
        ...ctx.message,
        isMentioned: false,
        isConversation: true,
        isButton: false,
      });

      if (response) await this.responseHandler(response, ctx);
    });
  }

  public addPayloadHandler(callback: (message: BotMessage) => Promise<BotResponse> | BotResponse, type: string): void {
    this.events.on('event', async (ctx) => {
      if (!ctx.message.payload || !ctx.message.payload.type) return;
      if (ctx.message.payload.type !== type) return;

      const { message } = ctx;

      const isConversation = message.peer_id >= CONVERSATION_START_ID;

      const response: BotResponse | undefined = await callback({
        ...ctx.message,
        isMentioned: false,
        isConversation: isConversation,
        isButton: true,
      });

      if (response) await this.responseHandler(response, ctx);
    });
  }

  public async responseHandler(response: BotResponse, ctx: VkBotContext): Promise<void> {
    this.log.debug(`Send message to queue`);
    if (response.type == 'text') {
      const { text, reply } = response;
      if (reply) {
        await this.sendQueue.reply({
          text,
          to: ctx.message.peer_id,
          from: ctx.message.conversation_message_id,
        });
      } else
        await this.sendQueue.sendMessage({
          text,
          to: ctx.message.peer_id,
          keyboard: response.keyboard?.toString(),
        });
    } else if (response.type == 'event') {
      await this.sendQueue.sendEvent({
        text: response.text,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        eventId: ctx.message.event_id,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        userId: ctx.message.user_id,
        peerId: ctx.message.peer_id,
      });
    }
  }

  public async isAdminInConversation(conversationId: number): Promise<boolean> {
    const response = await this.vkIoService.api.messages.getConversationsById({
      peer_ids: conversationId,
    });

    return response.count > 0;
  }

  private async onMessage(ctx: VkBotContextType) {
    /* if (ctx.message.peer_id < 2000000000 || ctx.message.text.length > 33) return;

    if (ctx.message.text.match(ADD_TO_GROUP)) return await this.onAddGroup(ctx);
    if (ctx.message.text === '!помощь') return await this.onHelp(ctx);

    if (
      ctx.message.text.match(SCHEDULE_ACTIVATION) ||
      ctx.message.text.match(WHAT_ACTIVATION) ||
      ctx.message.text.match(WHOM_ACTIVATION) ||
      ctx.message.text.match(AT_ACTIVATION)
    )
      return await this.onActivate(ctx);
    else if (ctx.message.text.match(NEXT_AUDIENCE)) return await this.onNext(ctx);
    else if (ctx.message.text.match(WHERE_AUDIENCE)) return await this.onWhere(ctx);*/
  }

  /*private async sendMessage(ctx, text: string) {
    return await this.sendQueue.send({ ctx, text });
  }*/
}
