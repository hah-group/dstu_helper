import { Injectable } from '@nestjs/common';
import { GroupEntity } from '../../group/group.entity';
import { Text } from '../../../framework/text/text';
import { DateParser } from '../../../framework/util/date-parser/date.parser';
import { LessonGroupProcessor } from '../../../framework/util/lesson-group/lesson-group.processor';
import { DateTime, Time } from '../../../framework/util/time';
import { WHERE_AUDIENCE } from './activation/where-audience.activation';
import { TimeRelativeProcessor } from '../../../framework/util/time-relative.processor';
import { nearestUp } from '../../../framework/util/nearest-up';
import { LessonGroupResult } from '../../../framework/util/lesson-group/lesson-group.type';
import { OrderDefinition } from './activation/definition/order-definition';
import { LanguageOrderDefinition, LanguageOrderKey } from '../../../framework/util/language-order-definition';

@Injectable()
export class ScheduleBuilder {
  public async buildAtDay(query: string | DateTime, group: GroupEntity, strict = false, yamaha = false): Promise<Text> {
    let atDate: DateTime;
    if (typeof query == 'string') atDate = DateParser.Parse(query);
    else atDate = query;

    const lessons = await group.getLessonsAtDate(atDate);
    const groups = new LessonGroupProcessor(lessons).getLessonGroups();

    if (yamaha) {
      return Text.Build('schedule-at-day_yamaha', {
        schedule: groups,
        group: group,
        atDate: atDate,
        strictDate: strict,
      });
    } else {
      return Text.Build('schedule-at-day', {
        schedule: groups,
        group: group,
        atDate: atDate,
        strictDate: strict,
      });
    }
  }

  public async buildWhere(now: boolean, group: GroupEntity): Promise<Text>;
  public async buildWhere(query: string, group: GroupEntity): Promise<Text>;
  public async buildWhere(query: string | boolean, group: GroupEntity): Promise<Text> {
    const currentTime = Time.get();
    let isNow;
    if (typeof query == 'string') isNow = !!query.match(WHERE_AUDIENCE);
    else isNow = query;

    const lessons = await group.getLessonsAtDate(currentTime);
    const lessonGroups = new LessonGroupProcessor(lessons);

    const orders = lessonGroups.getOrders();

    const nowOrder = TimeRelativeProcessor.now(false, currentTime);
    let order: number | undefined;
    if (isNow) order = nowOrder;
    else order = TimeRelativeProcessor.next(currentTime, orders[0]);

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

    return Text.Build('where-audience', {
      target: target,
      isLessonsExists: lessons.length > 0,
      isNow: isNow,
      isClosest: isClosest,
      isEndOfDay: isEndOfDay,
      group: group,
      atDate: currentTime,
    });
  }

  public async buildOrder(query: string, group: GroupEntity): Promise<Text | undefined> {
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
    const lessons = await group.getLessonsAtDate(currentTime);
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

    return Text.Build('order-lesson', {
      group: group,
      target: target,
      isClosest: order != targetOrder && !isNearestDown,
      order: order,
      isNearestDown: isNearestDown,
    });
  }
}
