import { Lesson } from 'src/old_modules/lesson/lesson.entity';
import Prisma from '@prisma/client';
import { User } from '../user/user.entity';
import { DateTime } from '../util/time';
import { GroupUpdateFailedException } from '../../framework/bot-exception/exception/group-update-failed.exception';
import { GroupUpdateInProgressException } from '../../framework/bot-exception/exception/group-update-in-progress.exception';
import { Logger } from '@nestjs/common';
import { DstuApiGroupInfo } from '../dstu/api-response-group.dstu.type';

export interface StudyGroupArgs {
  id: number;
  name: string;
  updateStatus: Prisma.UpdateStatus;
  lessons: Lesson[];
  users: Map<number, User>;
}

export class StudyGroup {
  public id: number;
  public name: string;
  public readonly lessons: Lesson[];
  private readonly log = new Logger('StudyGroup');
  private readonly _users: Map<number, User>;

  constructor(params: StudyGroupArgs) {
    const { id, lessons, name, updateStatus, users } = params;
    this.id = id;
    this.name = name;
    this._updateStatus = updateStatus;
    this.lessons = lessons;
    this._users = users;
  }

  public _updateStatus: Prisma.UpdateStatus;

  public get updateStatus(): Prisma.UpdateStatus {
    return this._updateStatus;
  }

  public set updateStatus(value: Prisma.UpdateStatus) {
    this._updateStatus = value;
    this.log.debug(`Set group ${this.name} update status ${value}`);
  }

  public get users(): User[] {
    const users = [];
    this._users.forEach((value) => users.push(value));
    return users;
  }

  public addUser(user: User): void {
    this._users.set(user.id, user);
    user.groupId = this.id;
  }

  public removeUser(user: User): void {
    this._users.delete(user.id);
  }

  public updateGroupInfo(info: DstuApiGroupInfo) {
    this.name = info.name;
    this.id = info.id;
  }

  public getLessonsAtDay(date: DateTime): Lesson[] {
    return this.lessons.filter((lesson) => lesson.isInDay(date));
  }

  public validate(): void {
    if (this.updateStatus == 'FAILURE') throw new GroupUpdateFailedException(this);
    else if (this.updateStatus == 'IN_PROGRESS') throw new GroupUpdateInProgressException(this);
  }
}
