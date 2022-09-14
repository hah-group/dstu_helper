import { LessonEntity } from 'src/modules/lesson/lesson.entity';

export type LessonGroupResult = LessonGroupSingle | LessonGroupSingleManyClassRooms | LessonGroupMultiply;

export type LessonGroupClassRoom = Pick<LessonEntity, 'subgroup' | 'classRoom' | 'corpus'>;

export interface LessonGroupSingle {
  order: number;
  type: 'SINGLE';
  lesson: LessonEntity;
}

export interface LessonGroupSingleManyClassRooms {
  order: number;
  type: 'SINGLE_DIFFERENT_CLASS_ROOMS';
  classRooms: LessonGroupClassRoom[];
  firstLesson: LessonEntity;
}

export interface LessonGroupMultiply {
  order: number;
  type: 'MULTIPLY';
  lessons: LessonEntity[];
}
