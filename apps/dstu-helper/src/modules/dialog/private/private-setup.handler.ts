import {
  BotInlineMessage,
  BotMessage,
  Content,
  DateTime,
  delay,
  KeyboardBuilder,
  OnButton,
  OnInlineButton,
  OnMessage,
  Time,
} from '@dstu_helper/common';
import { Injectable } from '@nestjs/common';
import * as moment from 'moment';

import { GroupEntity } from '../../schedule/group/group.entity';
import { GroupService } from '../../schedule/group/group.service';
import { UserRepository } from '../../user/user.repository';
import { UserProperties } from '../../user/user-properties/user-properties';
import { ScheduleBuilder } from '../schedule-text-query/schedule.builder';
import {
  MainMenuKeyboard,
  ScheduleButton,
  WhereAudienceButton,
  WhereNextAudienceButton,
} from './keyboard/main-menu.keyboard';
import {
  CurrentDateButton,
  NextDayButton,
  NextWeekButton,
  PrevDayButton,
  PrevWeekButton,
  ScheduleKeyboard,
  TodayButton,
} from './keyboard/schedule.keyboard';

const MY_GROUP_CHANGE_REGEX = /^\/моя группа ([a-zа-я\d\- ]*)/i;

@Injectable()
export class PrivateSetupHandler {
  constructor(
    private readonly scheduleBuilder: ScheduleBuilder,
    private readonly userRepository: UserRepository,
    private readonly groupService: GroupService,
  ) {}

  @OnMessage('/сброс', 'private')
  public async onReset(message: BotMessage): Promise<void> {
    const user = message.from.user;
    await message.send(Content.Build('private-reset'), new KeyboardBuilder());
    user.properties = new UserProperties();
    user.group = undefined;
    await this.userRepository.save(user);
    await delay(1000);
    await this.onStart(message);
  }

  @OnMessage(['/start$', 'старт$', '/старт$', 'start$', 'Начало$', 'Начать$'], 'private')
  public async onStart(message: BotMessage): Promise<void> {
    const isGroupExist = !!message.from.user.group;
    let keyboard: KeyboardBuilder | undefined;
    if (isGroupExist) keyboard = MainMenuKeyboard;

    await message.send(
      Content.Build('private-hello', {
        group: message.from.user.group,
      }),
      keyboard,
    );
  }

  @OnMessage(MY_GROUP_CHANGE_REGEX)
  public async onChangeGroup(message: BotMessage): Promise<void> {
    const match = message.payload.text.match(MY_GROUP_CHANGE_REGEX);
    if (!match || !match[1]) {
      await message.send(Content.Build('change-group-searching', { state: 'failed' }));
      return;
    }

    const group = await this.groupService.findGroup(match[1]);
    if (!group) {
      await message.send(Content.Build('change-group-searching', { state: 'failed' }));
    } else {
      message.from.user.group = Promise.resolve(group);
      await this.userRepository.save(message.from.user);

      let keyboard;
      if (message.chat.scope == 'private') keyboard = MainMenuKeyboard;

      await message.send(Content.Build('change-group-searching', { state: 'success' }), keyboard);
      if (message.chat.scope == 'private') await this.onSchedule(message);
    }
  }

  public async toHome(message: BotMessage): Promise<void> {
    await this.onToday(message, false, MainMenuKeyboard);
  }

  @OnButton(ScheduleButton, 'private')
  public async onSchedule(message: BotMessage): Promise<void> {
    await this.onToday(message, false);
  }

  @OnButton(WhereAudienceButton, 'private')
  public async onWhereAudience(message: BotMessage): Promise<void> {
    const group = await message.from.user.group;
    if (!group) {
      await message.send(Content.Build('group-not-found', { isConversation: message.chat.scope == 'conversation' }));
      return;
    }

    const text = await this.scheduleBuilder.buildWhere(true, group);
    await message.send(text);
  }

  @OnButton(WhereNextAudienceButton, 'private')
  public async onWhereNextAudience(message: BotMessage): Promise<void> {
    const group = await message.from.user.group;
    if (!group) {
      await message.send(Content.Build('group-not-found', { isConversation: message.chat.scope == 'conversation' }));
      return;
    }

    const text = await this.scheduleBuilder.buildWhere(false, group);
    await message.send(text);
  }

  @OnInlineButton(TodayButton())
  public async onToday(message: BotMessage, edit = true, keyboard?: KeyboardBuilder): Promise<void> {
    const group = await message.from.user.group;
    if (!group) {
      await message.send(Content.Build('group-not-found', { isConversation: message.chat.scope == 'conversation' }));
      return;
    }

    const currentDate = Time.get();

    await this.sendSchedule(currentDate, group, message, edit, keyboard);
  }

  @OnInlineButton(NextDayButton())
  public async onNextDay(message: BotMessage): Promise<void> {
    const group = await message.from.user.group;
    if (!group) {
      await message.send(Content.Build('group-not-found', { isConversation: message.chat.scope == 'conversation' }));
      return;
    }

    const currentDate = message.from.user.properties.selectedDate.get();
    const targetDate = moment(currentDate).add(1, 'd');

    await this.sendSchedule(targetDate, group, message);
  }

  @OnInlineButton(PrevDayButton())
  public async onPrevDay(message: BotMessage): Promise<void> {
    const group = await message.from.user.group;
    if (!group) {
      await message.send(Content.Build('group-not-found', { isConversation: message.chat.scope == 'conversation' }));
      return;
    }

    const currentDate = message.from.user.properties.selectedDate.get();
    const targetDate = moment(currentDate).subtract(1, 'd');

    await this.sendSchedule(targetDate, group, message);
  }

  @OnInlineButton(NextWeekButton())
  public async onNextWeek(message: BotMessage): Promise<void> {
    const group = await message.from.user.group;
    if (!group) {
      await message.send(Content.Build('group-not-found', { isConversation: message.chat.scope == 'conversation' }));
      return;
    }

    const currentDate = message.from.user.properties.selectedDate.get();
    const targetDate = moment(currentDate).add(1, 'w');

    await this.sendSchedule(targetDate, group, message);
  }

  @OnInlineButton(PrevWeekButton())
  public async onPrevWeek(message: BotMessage): Promise<void> {
    const group = await message.from.user.group;
    if (!group) {
      await message.send(Content.Build('group-not-found', { isConversation: message.chat.scope == 'conversation' }));
      return;
    }

    const currentDate = message.from.user.properties.selectedDate.get();
    const targetDate = moment(currentDate).subtract(1, 'w');

    await this.sendSchedule(targetDate, group, message);
  }

  @OnInlineButton(CurrentDateButton())
  public async onCurrentDate(message: BotInlineMessage): Promise<void> {
    await message.flush();
  }

  private async sendSchedule(
    targetDate: DateTime,
    group: GroupEntity,
    message: BotMessage,
    edit = true,
    keyboard?: KeyboardBuilder,
  ): Promise<void> {
    message.from.user.properties.selectedDate.set(targetDate);
    await this.userRepository.save(message.from.user);

    const text = await this.scheduleBuilder.buildAtDay(targetDate, group, true);
    keyboard = keyboard || ScheduleKeyboard(targetDate);

    if (edit) await message.edit(text, keyboard);
    else await message.send(text, keyboard);
  }
}