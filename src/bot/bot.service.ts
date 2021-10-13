import { Injectable, Logger } from '@nestjs/common';
import { DateParser } from '../util/date.parser';

import VkBot from 'node-vk-bot-api';
import { VkBotContextType } from './vk-bot-context.type';
import { VkBotInterface } from './vk-bot.interface';
import { StudyGroupService } from '../study-group/study-group.service';
import {
  ADD_TO_GROUP,
  AT_ACTIVATION,
  NEXT_AUDIENCE,
  SCHEDULE_ACTIVATION,
  TextProcessor,
  WHAT_ACTIVATION,
  WHERE_AUDIENCE,
  WHOM_ACTIVATION,
} from '../util/text.processor';
import * as moment from 'moment';
import { TimeRelativeProcessor } from '../util/time-relative.processor';
import { BotProducer } from './bot.producer';

@Injectable()
export class BotService {
  public bot: VkBotInterface;
  private readonly logger = new Logger(BotService.name);

  constructor(
    private scheduleService: StudyGroupService,
    private sendQueue: BotProducer,
    private groupService: StudyGroupService,
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.bot = new VkBot({
      token: process.env.BOT_TOKEN,
      confirmation: process.env.CONFIRMATION,
    });

    this.onMessage = this.onMessage.bind(this);
    this.bot.on(this.onMessage);
  }

  private async onAddGroup(ctx) {
    const regex = new RegExp(ADD_TO_GROUP);
    const groupName = regex.exec(ctx.message.text);
    if (groupName[1]) {
      const group = await this.groupService.findGroup(groupName[1].toUpperCase());
      if (!group) return this.sendMessage(ctx, TextProcessor.SOURCE_NOT_FOUND_GROUP);

      this.logger.log(`Adding a new student id${ctx.message.from_id} to the group ${group.name}`);
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
      if (schedule.updating) return this.sendMessage(ctx, TextProcessor.SCHEDULE_UPDATING);
      return this.sendMessage(ctx, TextProcessor.Compile(schedule, atDate.toDate()));
    } catch {
      return this.sendMessage(ctx, TextProcessor.NOT_FOUND_GROUP);
    }
  }

  private async onWhere(ctx) {
    try {
      const schedule = await this.scheduleService.studyGroup(ctx.message.from_id, moment().startOf('d'));
      if (schedule.updating) return this.sendMessage(ctx, TextProcessor.SCHEDULE_UPDATING);
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
      if (schedule.updating) return this.sendMessage(ctx, TextProcessor.SCHEDULE_UPDATING);

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
  }

  private async onMessage(ctx: VkBotContextType) {
    if (ctx.message.peer_id < 2000000000 || ctx.message.text.length > 33) return;

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
    else if (ctx.message.text.match(WHERE_AUDIENCE)) return await this.onWhere(ctx);
  }

  private async sendMessage(ctx, text: string) {
    return await this.sendQueue.send({ ctx, text });
  }
}
