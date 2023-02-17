import { Injectable } from '@nestjs/common';
import { BotMessage } from '../../../../framework/bot/type/bot-message.type';
import { lodash, OnMenuEnter, OnValueInput, TimeInterval } from '@dstu_helper/common';
import {
  MenuHandlerResponse,
} from '../../../../../../../libs/common/src/menu/decorator/accessor/type/menu-handler.type';
import { MenuValue } from '../../../../../../../libs/common/src/menu/decorator/menu-value.param-decorator';
import { NotificationRepository } from '../../../notification/notification.repository';
import { MenuTargets } from '../../../../../../../libs/common/src/menu/decorator/menu-targets.param-decorator';
import { MenuPath } from '../../../../../../../libs/common/src/menu/decorator/menu-path.param-decorator';
import { NotificationEntity } from '../../../notification/notification.entity';

@Injectable()
export class NotificationsSettingsHandler {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  @OnMenuEnter('settings.notifications')
  public async onNotifications(message: BotMessage): Promise<MenuHandlerResponse<any>> {
    const notifications = await this.notificationRepository.findAll({
      user: { id: message.from.user.id },
    });
    const notificationsMap = lodash.keyBy(notifications, (record) => record.event);

    return {
      data: {
        startLesson: {
          isEnabled: !!notificationsMap['startLesson'],
        },
        scheduleDay: {
          isEnabled: !!notificationsMap['scheduleDay'],
          ...notificationsMap['scheduleDay']?.properties.render(),
        },
        scheduleWeek: {
          isEnabled: !!notificationsMap['scheduleWeek'],
          ...notificationsMap['scheduleDay']?.properties.render(),
        },
        examinations: {
          isEnabled: !!notificationsMap['examinations'],
        },
      },
    };
  }

  @OnMenuEnter('settings.notifications.*')
  public async onNotificationChild(
    message: BotMessage,
    @MenuTargets() targets: string[],
  ): Promise<MenuHandlerResponse> {
    const notification = await this.notificationRepository.findOne({
      user: { id: message.from.user.id },
      event: targets[0],
    });
    return {
      data: {
        isEnabled: !!notification,
        ...notification?.properties.render(),
      },
    };
  }

  @OnValueInput('settings.notifications.(startLesson|exams).isEnabled')
  public async onNotificationsIsEnabledValue(
    message: BotMessage,
    @MenuValue() value: boolean,
    @MenuTargets() targets: string[],
  ): Promise<void> {
    if (value) {
      const notification = NotificationEntity.Create(message.from.user, targets[0]);
      await this.notificationRepository.upsert(notification);
    } else {
      const notification = await this.notificationRepository.findOne({
        user: { id: message.from.user.id },
        event: targets[0],
      });
      if (notification) await this.notificationRepository.delete(notification);
    }
  }

  @OnValueInput('settings.notifications.(scheduleDay|scheduleWeek).isEnabled')
  public async onNotificationsScheduleEnabledValue(
    message: BotMessage,
    @MenuValue() value: boolean,
    @MenuTargets() targets: string[],
  ): Promise<MenuHandlerResponse> {
    if (value) {
      return { stage: `settings.notifications.${targets[0]}.targetTime` };
    } else {
      const notification = await this.notificationRepository.findOne({
        user: { id: message.from.user.id },
        event: targets[0],
      });
      if (notification) await this.notificationRepository.delete(notification);
    }
  }

  @OnValueInput('settings.notifications.*.targetTime')
  public async onNotificationsTargetTimeIsEnabledValue(
    message: BotMessage,
    @MenuValue() value: TimeInterval | undefined,
    @MenuTargets() targets: string[],
    @MenuPath() path: string,
  ): Promise<MenuHandlerResponse> {
    let notification = await this.notificationRepository.findOne({
      user: { id: message.from.user.id },
      event: targets[0],
    });
    if (!notification) notification = NotificationEntity.Create(message.from.user, targets[0]);

    if (!value) return { stage: path, data: { isError: true } };
    notification.properties.targetTime.set(value);

    await this.notificationRepository.upsert(notification);
  }
}
