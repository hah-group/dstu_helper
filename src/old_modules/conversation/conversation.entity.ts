import { Nullable } from '../util/nullable';
import Prisma, { Role } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { User } from '../user/user.entity';
import { ConversationUserFactory } from '../user/conversation-user.factory';
import { ConversationUser } from '../user/conversation-user.entity';
import * as lodash from 'lodash';

export interface ConversationArgs {
  id: number;
  title: Nullable<string>;
  settings: any;
  users: Map<number, ConversationUser>;
  status: Prisma.ConversationStatus;
}

export class Conversation {
  public readonly id: number;
  public readonly settings: any;
  private readonly log = new Logger('Conversation');
  private readonly _users: Map<number, ConversationUser>;

  constructor(params: ConversationArgs) {
    const { id, settings, title, users, status } = params;
    this.id = id;
    this.settings = settings;
    this._title = title;
    this._status = status;
    this._users = users;
  }

  private _title: Nullable<string>;

  public get title(): Nullable<string> {
    return this._title;
  }

  public set title(value) {
    this._title = value;
  }

  private _status: Prisma.ConversationStatus;

  public get status(): Prisma.ConversationStatus {
    return this._status;
  }

  public set status(value) {
    this.log.log(`Set conversation ${this.id} status ${value}`);
    this._status = value;
  }

  public get users(): ConversationUser[] {
    const users = [];
    this._users.forEach((value) => users.push(value));
    return users;
  }

  public get groupsIds(): number[] {
    const groupsIds = this.users.map((user) => user.groupId);
    return lodash.uniq(groupsIds);
  }

  public addUser(user: User, role: Prisma.Role = 'STUDENT'): void {
    this.log.debug(`Adding user ${user.id} to conversation ${this.id}`);
    const conversationUser = ConversationUserFactory.createNew(user, role);
    this._users.set(user.id, conversationUser);
  }

  public reset(): void {
    this.log.debug(`Reset conversation ${this.id}`);
    this._users.clear();
    //this.settings = {};
    this._status = 'NOT_CONFIGURED';
    this._title = null;
  }

  public isAdmin(user: User): boolean {
    const conversationUser = this._users.get(user.id);
    return conversationUser && conversationUser.role == Role.ADMIN;
  }

  public isInviting(user: User): boolean {
    const conversationUser = this._users.get(user.id);
    return conversationUser && conversationUser.role == Role.INVITING;
  }

  public isAccessToSettings(user: User): boolean {
    const conversationUser = this._users.get(user.id);
    return conversationUser && [Role.ADMIN, Role.INVITING, Role.HEADMAN].some((role) => conversationUser.role == role);
  }

  public isMember(user: User): boolean {
    return !!this._users.get(user.id);
  }
}
