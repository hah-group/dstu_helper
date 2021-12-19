import { Lesson } from 'src/lesson/lesson.entity';
import Prisma from '@prisma/client';
import { User } from '../user/user.entity';
import { DateTime } from '../util/time';

export interface StudyGroupArgs {
  id: number;
  name: string;
  updateStatus: Prisma.UpdateStatus;
  lessons: Lesson[];
  users: Map<number, User>;
}

export class StudyGroup {
  public readonly id: number;
  public readonly name: string;
  public updateStatus: Prisma.UpdateStatus;
  public readonly lessons: Lesson[];
  private readonly _users: Map<number, User>;

  constructor(params: StudyGroupArgs) {
    const { id, lessons, name, updateStatus, users } = params;
    this.id = id;
    this.name = name;
    this.updateStatus = updateStatus;
    this.lessons = lessons;
    this._users = users;
  }

  public addUser(user: User): void {
    this._users.set(user.id, user);
  }

  public get users(): User[] {
    const users = [];
    this._users.forEach((value) => users.push(value));
    return users;
  }

  public getLessonsAtDay(date: DateTime): Lesson[] {
    return this.lessons.filter((lesson) => lesson.isInDay(date));
  }
}
