import { Lesson } from 'src/lesson/lesson.entity';
import Prisma from '@prisma/client';

export interface StudyGroupArgs {
  id: number;
  name: string;
  updateStatus: Prisma.UpdateStatus;
  lessons?: Lesson[];
}

export class StudyGroup {
  public readonly id: number;
  public readonly name: string;
  public updateStatus: Prisma.UpdateStatus;
  public readonly lessons?: Lesson[];

  constructor(params: StudyGroupArgs) {
    const { id, lessons, name, updateStatus } = params;
    this.id = id;
    this.name = name;
    this.updateStatus = updateStatus;
    this.lessons = lessons;
  }
}
