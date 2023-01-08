import { LessonEntity } from '../../../modules/schedule/lesson/lesson.entity';
import { AudienceEntity } from '../../../modules/schedule/audience/audience.entity';

export type LessonGroupResult =
  | LessonGroupSingle
  | LessonGroupSingleManyClassRooms
  | LessonGroupMultiply
  | LessonGroupSingleManyOrders;

export interface LessonGroupSingle {
  order: number;
  type: 'SINGLE';
  info: LessonEntity;
}

export interface LessonGroupSingleManyClassRooms {
  order: number;
  type: 'SINGLE_DIFFERENT_CLASS_ROOMS';
  destinations: {
    audience?: AudienceEntity;
    subgroup?: LessonEntity['subgroup'];
  }[];
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
