import { Injectable } from '@nestjs/common';
import { OnMessage } from '../../framework/bot/decorator/on-message.decorator';
import {
  PrivateMainMenuScheduleButton,
  PrivateMainMenuWhereLessonButton,
  PrivateMainMenuWhereNextLessonButton,
} from './private-main-menu.keyboard';
import { InlineButtonMessage, TextMessage } from '../../framework/bot/type/message.type';
import { StudyGroupService } from '../study-group/study-group.service';
import { TextProcessor } from '../util/text.processor';
import { DateTime, Time } from '../util/time';
import { OnEvent } from '@nestjs/event-emitter';
import { InternalEvent } from '../util/internal-event.enum';
import { UserService } from '../user/user.service';
import {
  PrivateDayScheduleKeyboard,
  PrivateDayScheduleNextDayButtonId,
  PrivateDayScheduleNextWeekButtonId,
  PrivateDaySchedulePreviousDayButtonId,
  PrivateDaySchedulePreviousWeekButtonId,
  PrivateDayScheduleTodayButtonId,
} from './private-day-schedule.keyboard';
import { OnInlineButton } from '../../framework/bot/decorator/on-inline-button.decorator';

@Injectable()
export class PrivateScheduleHandler {
  constructor(private readonly studyGroupService: StudyGroupService, private readonly userService: UserService) {}

  @OnMessage('/update')
  public async updateKeyboard(message: TextMessage): Promise<void> {
    message.user.menu.daySchedule.reset();
    //await message.send('Клава', PrivateMainMenuKeyboard);
  }

  @OnEvent(InternalEvent.SETUP_PRIVATE_SUCCESS)
  //@OnMessage(PrivateMainMenuScheduleButton, 'private')
  public async getSchedule(message: TextMessage): Promise<void> {
    message.user.menu.daySchedule.reset();

    const group = await this.studyGroupService.getByUser(message.user);
    if (!group) throw new Error('Not found group');
    group.validate();

    await message.send(TextProcessor.lessons(group, Time.get(), true), PrivateDayScheduleKeyboard(Time.get()), true);
    await this.userService.save(message.user);
  }

  @OnInlineButton(PrivateDaySchedulePreviousDayButtonId)
  public async previousDaySchedule(message: InlineButtonMessage): Promise<void> {
    const offset = message.user.menu.daySchedule.previousDay();
    const date = Time.get().add(offset, 'd');
    await this.sendDaySchedule(message, date);

    await this.userService.save(message.user);
  }

  @OnInlineButton(PrivateDayScheduleTodayButtonId)
  public async todaySchedule(message: InlineButtonMessage): Promise<void> {
    message.user.menu.daySchedule.today();
    const date = Time.get();
    await this.sendDaySchedule(message, date);

    await this.userService.save(message.user);
  }

  @OnInlineButton(PrivateDayScheduleNextDayButtonId)
  public async nextDaySchedule(message: InlineButtonMessage): Promise<void> {
    const offset = message.user.menu.daySchedule.nextDay();
    const date = Time.get().add(offset, 'd');
    await this.sendDaySchedule(message, date);

    await this.userService.save(message.user);
  }

  @OnInlineButton(PrivateDaySchedulePreviousWeekButtonId)
  public async previousWeekSchedule(message: InlineButtonMessage): Promise<void> {
    const offset = message.user.menu.daySchedule.previousWeek();
    const date = Time.get().add(offset, 'd');
    await this.sendDaySchedule(message, date);

    await this.userService.save(message.user);
  }

  @OnInlineButton(PrivateDayScheduleNextWeekButtonId)
  public async nextWeekSchedule(message: InlineButtonMessage): Promise<void> {
    const offset = message.user.menu.daySchedule.nextWeek();
    const date = Time.get().add(offset, 'd');
    await this.sendDaySchedule(message, date);

    await this.userService.save(message.user);
  }

  /*@OnMessage(PrivateMainMenuWhereLessonButton, 'private')
  public async currentLesson(message: TextMessage): Promise<void> {
    const group = await this.studyGroupService.getByUser(message.user);
    if (!group) throw new Error('Not found group');
    await message.send(TextProcessor.short(group, true));
  }

  @OnMessage(PrivateMainMenuWhereNextLessonButton, 'private')
  public async nextLesson(message: TextMessage): Promise<void> {
    const group = await this.studyGroupService.getByUser(message.user);
    if (!group) throw new Error('Not found group');
    await message.send(TextProcessor.short(group, false));
  }*/

  private async sendDaySchedule(message: InlineButtonMessage, date: DateTime): Promise<void> {
    const group = await this.studyGroupService.getByUser(message.user);
    if (!group) throw new Error('Not found group');
    group.validate();

    await message.edit(TextProcessor.lessons(group, date, true), undefined, PrivateDayScheduleKeyboard(date));
  }
}
