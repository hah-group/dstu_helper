import { LessonEntity } from 'src/modules/lesson/lesson.entity';
import { DateTime } from '../time';

export type LessonGroupResult =
  | LessonGroupSingle
  | LessonGroupSingleManyClassRooms
  | LessonGroupMultiply
  | LessonGroupSingleManyOrders;

export type LessonDestination = Pick<LessonEntity, 'subgroup' | 'classRoom' | 'corpus'>;

export interface LessonGroupSingle {
  order: number;
  type: 'SINGLE';
  info: LessonEntity;
}

export interface LessonGroupSingleManyClassRooms {
  order: number;
  type: 'SINGLE_DIFFERENT_CLASS_ROOMS';
  destinations: LessonDestination[];
  info: LessonEntity;
}

export interface LessonGroupMultiply {
  order: number;
  type: 'MULTIPLY';
  info: LessonEntity[];
}

export interface LessonGroupSingleManyOrders {
  orders: number[];
  type: 'SINGLE_LESSON_MANY_ORDERS';
  start: Date;
  end: Date;
  info: LessonEntity;
}
