import { Nullable } from '../util/nullable';
import Prisma, { Role } from '@prisma/client';
import { Logger } from '@nestjs/common';
import { User } from '../user/user.entity';
import { ConversationUserFactory } from '../user/conversation-user.factory';
import { ConversationUser } from '../user/conversation-user.entity';

export interface ConversationArgs {
  id: number;
  title: Nullable<string>;
  settings: any;
  users: Map<number, ConversationUser>;
  status: Prisma.ConversationStatus;
}

export class Conversation {
  private readonly log = new Logger('Conversation');

  public readonly id: number;
  private _title: Nullable<string>;
  public readonly settings: any;
  private _status: Prisma.ConversationStatus;
  private readonly _users: Map<number, ConversationUser>;

  constructor(params: ConversationArgs) {
    const { id, settings, title, users, status } = params;
    this.id = id;
    this.settings = settings;
    this._title = title;
    this._status = status;
    this._users = users;
  }

  public addUser(user: User, role: Prisma.Role = 'STUDENT'): void {
    this.log.debug(`Adding user ${user.id} to conversation ${this.id}`);
    const conversationUser = ConversationUserFactory.createNew(user, role);
    this._users.set(user.id, conversationUser);
  }

  public get users(): ConversationUser[] {
    const users = [];
    this._users.forEach((value) => users.push(value));
    return users;
  }

  public isAdmin(user: User): boolean {
    const conversationUser = this._users.get(user.id);
    return conversationUser && conversationUser.role == Role.ADMIN;
  }

  public get status(): Prisma.ConversationStatus {
    return this._status;
  }

  public set status(value) {
    this.log.log(`Set conversation ${this.id} status ${value}`);
    this._status = value;
  }

  public get title(): Nullable<string> {
    return this._title;
  }

  public set title(value) {
    this._title = value;
  }
}
