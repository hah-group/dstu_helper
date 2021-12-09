import { Nullable } from '../util/nullable';
import { User } from '../user/user.entity';
import { ConversationUser } from '../user/conversation-user.entity';

export interface ConversationArgs {
  id: number;
  title: Nullable<string>;
  settings: any;
  users: Map<number, ConversationUser>;
}

export class Conversation {
  public readonly id: number;
  public readonly title: Nullable<string>;
  public readonly settings: any;
  private readonly _users: Map<number, ConversationUser>;

  constructor(params: ConversationArgs) {
    const { id, settings, title, users } = params;
    this.id = id;
    this.settings = settings;
    this.title = title;
    this._users = users;
  }

  public addUser(user: ConversationUser): void {
    this._users.set(user.id, user);
  }

  public get users(): ConversationUser[] {
    const users = [];
    this._users.forEach((value) => users.push(value));
    return users;
  }
}
