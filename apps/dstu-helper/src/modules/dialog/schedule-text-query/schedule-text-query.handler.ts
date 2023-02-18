import { BotMessage, Content, DateParser, OnMessage, Time } from '@dstu_helper/common';
import { Injectable } from '@nestjs/common';

import { ConversationRepository } from '../../conversation/conversation.repository';
import { GroupEntity } from '../../schedule/group/group.entity';
import { LessonRepository } from '../../schedule/lesson/lesson.repository';
import { LessonGroupProcessor } from '../../schedule/processor/lesson-group/lesson-group.processor';
import { AtActivation } from './activation/at.activation';
import { ORDER_LESSON_ACTIVATION } from './activation/order.activation';
import { ORDER_FIRST_LESSON_ACTIVATION } from './activation/order-first.activation';
import { ORDER_LAST_LESSON_ACTIVATION } from './activation/order-last.activation';
import { ScheduleActivation } from './activation/schedule.activation';
import { WhatActivation } from './activation/what.activation';
import { NEXT_AUDIENCE, WHERE_AUDIENCE } from './activation/where-audience.activation';
import { WhomActivation } from './activation/whom.activation';
import { ScheduleBuilder } from './schedule.builder';

@Injectable()
export class ScheduleTextQueryHandler {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly scheduleBuilder: ScheduleBuilder,
    private readonly lessonRepository: LessonRepository,
  ) {}

  @OnMessage([ScheduleActivation, AtActivation, WhatActivation, WhomActivation])
  public async schedule(message: BotMessage): Promise<void> {
    const group = await this.getGroup(message);

    if (!group) {
      await message.send(Content.Build('group-not-found', { isConversation: message.chat.scope == 'conversation' }));
      return;
    }

    await message.send(await this.scheduleBuilder.buildAtDay(message.payload.text, group));
  }

  @OnMessage([WHERE_AUDIENCE, NEXT_AUDIENCE])
  public async whereAudience(message: BotMessage): Promise<void> {
    const group = await this.getGroup(message);
    if (!group) {
      await message.send(Content.Build('group-not-found', { isConversation: message.chat.scope == 'conversation' }));
      return;
    }

    await message.send(await this.scheduleBuilder.buildWhere(message.payload.text, group));
  }

  @OnMessage(ORDER_LESSON_ACTIVATION)
  public async orderLesson(message: BotMessage): Promise<void> {
    const group = await this.getGroup(message);
    if (!group) {
      await message.send(Content.Build('group-not-found', { isConversation: message.chat.scope == 'conversation' }));
      return;
    }

    const text = await this.scheduleBuilder.buildOrder(message.payload.text, group);
    if (text) await message.send(text);
  }

  @OnMessage(ORDER_LAST_LESSON_ACTIVATION)
  public async orderLastLesson(message: BotMessage): Promise<void> {
    const group = await this.getGroup(message);
    if (!group) {
      await message.send(Content.Build('group-not-found', { isConversation: message.chat.scope == 'conversation' }));
      return;
    }

    const currentTime = Time.get();
    const lessons = await this.lessonRepository.getAtDate(currentTime, group);
    const lessonGroups = new LessonGroupProcessor(lessons);

    const orders = lessonGroups.getOrders();

    const target = lessonGroups.getLessonGroup(orders[orders.length - 1]);
    //this.log.log(`Request order last audience in ${message.peerId} for group ${group.name}`);

    await message.send(
      Content.Build('last-lesson', {
        target: target,
        group: group,
      }),
    );
  }

  @OnMessage(ORDER_FIRST_LESSON_ACTIVATION)
  public async orderFirstLesson(message: BotMessage): Promise<void> {
    const group = await this.getGroup(message);
    if (!group) {
      await message.send(Content.Build('group-not-found', { isConversation: message.chat.scope == 'conversation' }));
      return;
    }

    const atDate = DateParser.Parse(message.payload.text);
    const lessons = await this.lessonRepository.getAtDate(atDate, group);
    const lessonGroups = new LessonGroupProcessor(lessons);

    const orders = lessonGroups.getOrders();

    const target = lessonGroups.getLessonGroup(orders[0]);

    await message.send(
      Content.Build('first-lesson', {
        target: target,
        order: orders[0],
        group: group,
        atDate: atDate,
      }),
    );
  }

  private async getGroup(message: BotMessage): Promise<GroupEntity | undefined> {
    let group = message.from.user.group;
    if (!group) {
      if (message.chat.scope == 'conversation') {
        const conversation = await this.conversationRepository.getById(message.chat.id, message.provider);
        if (conversation) group = conversation.defaultGroup;
      }
    }

    return group;
  }
}
