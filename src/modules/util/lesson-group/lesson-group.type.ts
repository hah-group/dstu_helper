import { Lesson } from '../../lesson/lesson.entity';

export type LessonGroupResult = LessonGroupSingle | LessonGroupSingleManyClassRooms | LessonGroupMultiply;

export type LessonGroupClassRoom = Pick<Lesson, 'subgroup' | 'classRoom' | 'corpus'>;

export interface LessonGroupSingle {
  order: number;
  type: 'SINGLE';
  lesson: Lesson;
}

export interface LessonGroupSingleManyClassRooms {
  order: number;
  type: 'SINGLE_DIFFERENT_CLASS_ROOMS';
  classRooms: LessonGroupClassRoom[];
  firstLesson: Lesson;
}

export interface LessonGroupMultiply {
  order: number;
  type: 'MULTIPLY';
  lessons: Lesson[];
}
