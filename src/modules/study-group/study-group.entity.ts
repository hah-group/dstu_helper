import { Lesson } from 'src/modules/lesson/lesson.entity';
import Prisma from '@prisma/client';
import { User } from '../user/user.entity';
import { DateTime } from '../util/time';
import { GroupUpdateFailedException } from '../bot-exception/exception/group-update-failed.exception';
import { GroupUpdateInProgressException } from '../bot-exception/exception/group-update-in-progress.exception';
import { Logger } from '@nestjs/common';

export interface StudyGroupArgs {
  id: number;
  name: string;
  updateStatus: Prisma.UpdateStatus;
  lessons: Lesson[];
  users: Map<number, User>;
}

export class StudyGroup {
  private readonly log = new Logger('StudyGroup');

  public readonly id: number;
  public readonly name: string;

  constructor(params: StudyGroupArgs) {
    const { id, lessons, name, updateStatus, users } = params;
    this.id = id;
    this.name = name;
    this._updateStatus = updateStatus;
    this.lessons = lessons;
    this._users = users;
  }

  public readonly lessons: Lesson[];
  private readonly _users: Map<number, User>;

  public _updateStatus: Prisma.UpdateStatus;

  public addUser(user: User): void {
    this._users.set(user.id, user);
    user.groupId = this.id;
  }

  public removeUser(user: User): void {
    this._users.delete(user.id);
  }

  public get users(): User[] {
    const users = [];
    this._users.forEach((value) => users.push(value));
    return users;
  }

  public get updateStatus(): Prisma.UpdateStatus {
    return this._updateStatus;
  }

  public set updateStatus(value: Prisma.UpdateStatus) {
    this._updateStatus = value;
    this.log.debug(`Set group ${this.name} update status ${value}`);
  }

  public getLessonsAtDay(date: DateTime): Lesson[] {
    return this.lessons.filter((lesson) => lesson.isInDay(date));
  }

  public validate(): void {
    if (this.updateStatus == 'FAILURE') throw new GroupUpdateFailedException(this);
    else if (this.updateStatus == 'IN_PROGRESS') throw new GroupUpdateInProgressException(this);
  }
}
