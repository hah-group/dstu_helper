import * as lodash from 'lodash';
import {
  LessonGroupMultiply,
  LessonGroupResult,
  LessonGroupSingle,
  LessonGroupSingleManyClassRooms,
  LessonGroupSingleManyOrders,
} from './lesson-group.type';
import { LessonEntity } from '../../../modules/lesson/lesson.entity';

export class LessonGroupProcessor {
  private readonly allLessons: LessonEntity[];

  constructor(lessons: LessonEntity[]) {
    this.allLessons = lessons;
  }

  public getOrders(): number[] {
    const allOrders = this.allLessons.map((lesson) => lesson.order);
    const uniqueOrders = lodash.uniq(allOrders);
    return uniqueOrders.sort((a, b) => a - b);
  }

  public getLessonGroup(order: number): LessonGroupResult | undefined {
    const groups = this.getLessonGroups();
    for (const group of groups) {
      let orders = [];
      if (group.type != 'SINGLE_LESSON_MANY_ORDERS') orders = [group.order];
      else orders = group.orders;

      if (orders.includes(order)) return group;
    }
  }

  public getLessonGroups(): LessonGroupResult[] {
    const orders = this.getOrders();
    const excludedOrders: number[] = [];
    const grouped = orders.map((order) => {
      if (excludedOrders.includes(order)) return;

      const lessons = this.allLessons.filter((lesson) => lesson.order == order);

      const manyOrdersGroup = this.tryGroupSingleLessonManyOrder(order);
      if (manyOrdersGroup) {
        excludedOrders.push(...manyOrdersGroup.orders);
        return manyOrdersGroup;
      }
      return (
        this.tryGroupSingle(lessons) ||
        this.tryGroupSingleDifferentClassRooms(lessons) ||
        this.tryGroupMultiply(lessons)
      );
    });

    return lodash.compact(grouped).sort((a, b) => {
      let orderA;
      let orderB;
      if (a.type == 'SINGLE_LESSON_MANY_ORDERS') orderA = a.orders[0];
      else orderA = a.order;

      if (b.type == 'SINGLE_LESSON_MANY_ORDERS') orderB = b.orders[0];
      else orderB = b.order;

      return orderA - orderB;
    });
  }

  private tryGroupSingle(lessons: LessonEntity[]): LessonGroupSingle | undefined {
    const gropedBySubjects = lodash.uniqBy(lessons, (lesson) => lesson.name);
    const groupedByClassRoom = lodash.uniqBy(lessons, (lesson) => lesson.getDestination());

    if (gropedBySubjects.length == 1 && groupedByClassRoom.length == 1) {
      const oneLesson = lessons[0];

      return {
        order: oneLesson.order,
        type: 'SINGLE',
        info: oneLesson,
      };
    }
  }

  private tryGroupSingleDifferentClassRooms(lessons: LessonEntity[]): LessonGroupSingleManyClassRooms | undefined {
    const gropedBySubjects = lodash.uniqBy(lessons, (lesson) => lesson.name);
    if (gropedBySubjects.length != 1) return;

    let resultLessons = lessons;

    const isSubgroupsExist = lodash.some(lessons, (lesson) => lesson.subgroup);
    if (isSubgroupsExist) resultLessons = lessons.sort((a, b) => a.subgroup - b.subgroup);

    const firstLesson = resultLessons[0];

    return {
      order: firstLesson.order,
      type: 'SINGLE_DIFFERENT_CLASS_ROOMS',
      destinations: resultLessons.map((lesson) => ({
        subgroup: lesson.subgroup,
        classRoom: lesson.classRoom,
        corpus: lesson.corpus,
      })),
      info: firstLesson,
    };
  }

  private tryGroupMultiply(lessons: LessonEntity[]): LessonGroupMultiply | undefined {
    const gropedBySubjects = lodash.uniqBy(lessons, (lesson) => lesson.name);

    if (gropedBySubjects.length < 2) return;

    return {
      order: gropedBySubjects[0].order,
      type: 'MULTIPLY',
      info: lessons,
    };
  }

  private tryGroupSingleLessonManyOrder(startOrder: number): LessonGroupSingleManyOrders | undefined {
    const sortedLessons = this.allLessons.sort((a, b) => a.order - b.order);

    let lastKey = this.getLessonKey(sortedLessons[0]);
    let lastOrder: number | undefined;
    let i = 0;
    const groups: LessonEntity[][] = [];

    for (const lesson of sortedLessons) {
      const key = this.getLessonKey(lesson);
      if (key != lastKey || (lastOrder && lastOrder + 1 != lesson.order)) {
        i += 1;
        lastKey = key;
      }

      if (!groups[i]) groups[i] = [];
      groups[i].push(lesson);
      lastOrder = lesson.order;
    }

    for (const group of groups) {
      let orders = group.map((lesson) => lesson.order);
      if (orders.length < 2) continue;
      orders = orders.sort((a, b) => a - b);

      if (orders[0] == startOrder)
        return {
          orders: orders,
          type: 'SINGLE_LESSON_MANY_ORDERS',
          start: group[0].start,
          end: group[group.length - 1].end,
          info: group[0],
        };
    }
  }

  private getLessonKey(lesson: LessonEntity): string {
    return `${lesson.name}_${lesson.getDestination()}_${lesson.type}_${lesson.subgroup}_${lesson.subsection}`;
  }
}
