/*
import { Lesson } from '../../lesson/lesson.entity';
import * as lodash from 'lodash';
import {
  LessonGroupMultiply,
  LessonGroupResult,
  LessonGroupSingle,
  LessonGroupSingleManyClassRooms,
} from './lesson-group.type';

export class LessonGroupProcessor {
  private readonly allLessons: Lesson[];

  constructor(lessons: Lesson[]) {
    this.allLessons = lessons;
  }

  public getOrders(): number[] {
    const allOrders = this.allLessons.map((lesson) => lesson.order);
    const uniqueOrders = lodash.uniq(allOrders);
    return uniqueOrders.sort((a, b) => a - b);
  }

  public getLessonGroup(order: number): LessonGroupResult {
    const lessons = this.allLessons.filter((lesson) => lesson.order == order);

    return (
      this.tryGroupSingle(lessons) || this.tryGroupSingleDifferentClassRooms(lessons) || this.tryGroupMultiply(lessons)
    );
  }

  private tryGroupSingle(lessons: Lesson[]): LessonGroupSingle | undefined {
    const gropedBySubjects = lodash.uniqBy(lessons, (lesson) => lesson.name);
    const groupedByClassRoom = lodash.uniqBy(lessons, (lesson) =>
      TextProcessor.buildClassRoom(lesson.classRoom, false, lesson.corpus),
    );

    if (gropedBySubjects.length != 1 || groupedByClassRoom.length != 1) return;

    const oneLesson = gropedBySubjects[0];

    return {
      order: oneLesson.order,
      type: 'SINGLE',
      lesson: oneLesson,
    };
  }

  private tryGroupSingleDifferentClassRooms(lessons: Lesson[]): LessonGroupSingleManyClassRooms | undefined {
    const gropedBySubjects = lodash.uniqBy(lessons, (lesson) => lesson.name);
    if (gropedBySubjects.length != 1) return;

    let resultLessons = lessons;

    const isSubgroupsExist = lodash.some(lessons, (lesson) => lesson.subgroup);
    if (isSubgroupsExist) resultLessons = lessons.sort((a, b) => a.subgroup - b.subgroup);

    const firstLesson = resultLessons[0];

    return {
      order: firstLesson.order,
      type: 'SINGLE_DIFFERENT_CLASS_ROOMS',
      classRooms: resultLessons.map((lesson) => ({
        subgroup: lesson.subgroup,
        classRoom: lesson.classRoom,
        corpus: lesson.corpus,
      })),
      firstLesson: firstLesson,
    };
  }

  private tryGroupMultiply(lessons: Lesson[]): LessonGroupMultiply | undefined {
    const gropedBySubjects = lodash.uniqBy(lessons, (lesson) => lesson.name);

    if (gropedBySubjects.length < 2) return;

    return {
      order: gropedBySubjects[0].order,
      type: 'MULTIPLY',
      lessons: lessons,
    };
  }
}
*/
