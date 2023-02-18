import {
  BooleanValueMenu,
  Content,
  MenuItemDeclaration,
  TimeIntervalValueMenu,
  TimeValueMenu,
} from '@dstu_helper/common';

import { AppearanceSettingsPage } from '../appearance/menu/appearance-settings.page';
import { AppearanceSettingsInnerPage } from '../appearance/menu/appearance-settings-inner.page';
import { AppearanceButtonValueMenu } from '../appearance/menu/value/appearance-button-value.menu';
import { NotificationsSettingsPage } from '../notifications/page/notifications-settings.page';
import { NotificationsSettingsInnerPage } from '../notifications/page/notifications-settings-inner.page';
import { MainSettingsPage } from './page/main-settings.page';

export const SettingsMenu: MenuItemDeclaration = {
  stage: 'settings',
  instance: new MainSettingsPage(),
  children: [
    [
      {
        stage: 'notifications',
        instance: new NotificationsSettingsPage(),
        children: [
          [
            {
              stage: 'startLesson',
              instance: new NotificationsSettingsInnerPage('startLesson'),
              children: [
                [
                  {
                    stage: 'isEnabled',
                    instance: new BooleanValueMenu('isEnabled'),
                  },
                ],
              ],
            },
          ],
          [
            {
              stage: 'scheduleDay',
              instance: new NotificationsSettingsInnerPage('scheduleDay'),
              children: [
                [
                  {
                    stage: 'isEnabled',
                    instance: new BooleanValueMenu('isEnabled'),
                  },
                ],
                [
                  {
                    stage: 'targetTime',
                    instance: new TimeIntervalValueMenu(
                      'notifications-settings-scheduleDay-time-header',
                      'notifications-settings-scheduleDay-time-content',
                      [
                        Content.Build('notifications-settings-scheduleDay-time-suggestions', { example: 1 }),
                        Content.Build('notifications-settings-scheduleDay-time-suggestions', { example: 2 }),
                        Content.Build('notifications-settings-scheduleDay-time-suggestions', { example: 3 }),
                        Content.Build('notifications-settings-scheduleDay-time-suggestions', { example: 4 }),
                      ],
                      { isHidden: '!isEnabled' },
                    ),
                  },
                ],
              ],
            },
          ],
          [
            {
              stage: 'scheduleWeek',
              instance: new NotificationsSettingsInnerPage('scheduleWeek'),
              children: [
                [
                  {
                    stage: 'isEnabled',
                    instance: new BooleanValueMenu('isEnabled'),
                  },
                ],
                [
                  {
                    stage: 'targetTime',
                    instance: new TimeValueMenu(
                      'notifications-settings-scheduleWeek-time-header',
                      'notifications-settings-scheduleWeek-time-content',
                      [
                        Content.Build('notifications-settings-scheduleWeek-time-suggestions', { example: 1 }),
                        Content.Build('notifications-settings-scheduleWeek-time-suggestions', { example: 2 }),
                        Content.Build('notifications-settings-scheduleWeek-time-suggestions', { example: 3 }),
                        Content.Build('notifications-settings-scheduleWeek-time-suggestions', { example: 4 }),
                      ],
                      { isHidden: '!isEnabled' },
                    ),
                  },
                ],
              ],
            },
          ],
          [
            {
              stage: 'exams',
              instance: new NotificationsSettingsInnerPage('exams'),
              children: [
                [
                  {
                    stage: 'isEnabled',
                    instance: new BooleanValueMenu('isEnabled'),
                  },
                ],
              ],
            },
          ],
        ],
      },
      {
        stage: 'appearance',
        instance: new AppearanceSettingsPage(),
        children: [
          [
            {
              stage: 'lesson-type',
              instance: new AppearanceSettingsInnerPage('lesson.type'),
              children: [
                [
                  {
                    stage: 'value',
                    instance: new AppearanceButtonValueMenu('show'),
                  },
                  {
                    stage: 'value',
                    instance: new AppearanceButtonValueMenu('short'),
                  },
                ],
                [
                  {
                    stage: 'value',
                    instance: new AppearanceButtonValueMenu('hidden'),
                  },
                ],
              ],
            },
          ],
          [
            {
              stage: 'teacher-name',
              instance: new AppearanceSettingsInnerPage('teacher.name'),
              children: [
                [
                  {
                    stage: 'value',
                    instance: new AppearanceButtonValueMenu('show'),
                  },
                  {
                    stage: 'value',
                    instance: new AppearanceButtonValueMenu('short'),
                  },
                ],
                [
                  {
                    stage: 'value',
                    instance: new AppearanceButtonValueMenu('hidden'),
                  },
                ],
              ],
            },
            {
              stage: 'teacher-degree',
              instance: new AppearanceSettingsInnerPage('teacher.degree'),
              children: [
                [
                  {
                    stage: 'value',
                    instance: new AppearanceButtonValueMenu('show'),
                  },
                  {
                    stage: 'value',
                    instance: new AppearanceButtonValueMenu('only_high'),
                  },
                ],
                [
                  {
                    stage: 'value',
                    instance: new AppearanceButtonValueMenu('hidden'),
                  },
                ],
              ],
            },
          ],
          [
            {
              stage: 'global-emoji',
              instance: new AppearanceSettingsInnerPage('global.emoji'),
              children: [
                [
                  {
                    stage: 'value',
                    instance: new AppearanceButtonValueMenu('show'),
                  },
                  {
                    stage: 'value',
                    instance: new AppearanceButtonValueMenu('hidden'),
                  },
                ],
              ],
            },
          ],
          [
            {
              stage: 'global-theme',
              instance: new AppearanceSettingsInnerPage('global.theme'),
              children: [
                [
                  {
                    stage: 'value',
                    instance: new AppearanceButtonValueMenu('light'),
                  },
                  {
                    stage: 'value',
                    instance: new AppearanceButtonValueMenu('dark'),
                  },
                ],
              ],
            },
          ],
        ],
      },
    ],
  ],
};
