import {
  Content,
  DateParser,
  DateTime,
  LanguageOrderDefinition,
  LanguageOrderKey,
  nearestUp,
  Time,
} from '@dstu_helper/common';
import { Injectable } from '@nestjs/common';

import { GroupEntity } from '../../schedule/group/group.entity';
import { LessonRepository } from '../../schedule/lesson/lesson.repository';
import { LessonGroupProcessor } from '../../schedule/processor/lesson-group/lesson-group.processor';
import { LessonGroupResult } from '../../schedule/processor/lesson-group/lesson-group.type';
import { TimeOrderProcessor } from '../../schedule/processor/lesson-time-order/time-order.processor';
import { OrderDefinition } from './activation/definition/order-definition';
import { WHERE_AUDIENCE } from './activation/where-audience.activation';

@Injectable()
export class ScheduleBuilder {
  constructor(private readonly lessonRepository: LessonRepository) {}

  public async buildAtDay(query: string | DateTime, group: GroupEntity, strict = false): Promise<Content> {
    let atDate: DateTime;
    if (typeof query == 'string') atDate = DateParser.Parse(query);
    else atDate = query;

    const lessons = await this.lessonRepository.getAtDate(atDate, group);
    const groups = new LessonGroupProcessor(lessons).getLessonGroups();

    return Content.Build('schedule-at-day', {
      schedule: groups,
      group: group,
      atDate: atDate,
      strictDate: strict,
    });
  }

  public async buildWhere(now: boolean, group: GroupEntity): Promise<Content>;
  public async buildWhere(query: string, group: GroupEntity): Promise<Content>;
  public async buildWhere(query: string | boolean, group: GroupEntity): Promise<Content> {
    const currentTime = Time.get();
    let isNow;
    if (typeof query == 'string') isNow = !!query.match(WHERE_AUDIENCE);
    else isNow = query;

    const lessons = await this.lessonRepository.getAtDate(currentTime, group);
    const lessonGroups = new LessonGroupProcessor(lessons);

    const orders = lessonGroups.getOrders();

    const nowOrder = TimeOrderProcessor.now(false, currentTime);
    let order: number | undefined;
    if (isNow) order = nowOrder;
    else order = TimeOrderProcessor.next(currentTime, orders[0]);

    const lastInOrder = orders[orders.length - 1];
    const isEndOfDay = !nowOrder || lastInOrder < nowOrder;

    let isClosest = order && order < (nearestUp(order, orders) || -1);
    if (isClosest) order = order && (nearestUp(order, orders) || -1);

    // Условие для ситуаций, когда студент опаздывает и хочет узнать следующую пару
    if (isClosest && !isNow) {
      order = orders[1];
      isClosest = false;
    }

    const target: LessonGroupResult | undefined = lessonGroups.getLessonGroup(order || -1);

    return Content.Build('where-audience', {
      target: target,
      isLessonsExists: lessons.length > 0,
      isNow: isNow,
      isClosest: isClosest,
      isEndOfDay: isEndOfDay,
      group: group,
      atDate: currentTime,
    });
  }

  public async buildOrder(query: string, group: GroupEntity): Promise<Content | undefined> {
    const orderMatch = query.match(/\d/);
    let order: number | undefined;

    if (orderMatch) {
      order = parseInt(orderMatch[0]);
    } else {
      const langOrderMatch = query.match(OrderDefinition);
      if (!langOrderMatch) return;
      order = LanguageOrderDefinition[<LanguageOrderKey>langOrderMatch[0]];
    }

    if (!order) return;

    const currentTime = Time.get();
    const lessons = await this.lessonRepository.getAtDate(currentTime, group);
    const lessonGroups = new LessonGroupProcessor(lessons);

    const orders = lessonGroups.getOrders();
    let targetOrder = nearestUp(order, orders);

    // Для ситуаций, когда последняя пара раньше указанной
    let isNearestDown = false;
    if (!targetOrder) {
      targetOrder = orders[orders.length - 1];
      isNearestDown = true;
    }
    const target = lessonGroups.getLessonGroup(targetOrder);
    //this.log.log(`Request order audience ${order} in ${message.peerId} for group ${group.name}`);

    return Content.Build('order-lesson', {
      group: group,
      target: target,
      isClosest: order != targetOrder && !isNearestDown,
      order: order,
      isNearestDown: isNearestDown,
    });
  }
}
