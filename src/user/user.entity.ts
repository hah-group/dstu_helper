import { Nullable } from '../util/nullable';
import { UserConversation } from './user-conversation.entity';

export interface UserArgs {
  id: number;
  firstName: string;
  lastName: string;
  group: Nullable<any>;
  conversations: Map<number, UserConversation>;
}

export class User {
  public readonly id: number;
  public readonly firstName: string;
  public readonly lastName: string;
  public readonly group: Nullable<any>;
  public readonly _conversations: Map<number, UserConversation>;

  constructor(params: UserArgs) {
    const { conversations, firstName, group, id, lastName } = params;
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.group = group;
    this._conversations = conversations;
  }

  public get conversations(): UserConversation[] {
    const conversations = [];
    this._conversations.forEach((value) => conversations.push(value));
    return conversations;
  }

  public addToConversation(conversation: UserConversation): void {
    this._conversations.set(conversation.id, conversation);
  }
}
