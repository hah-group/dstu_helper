import { User } from './user.entity';
import { Role } from '@prisma/client';
import { Nullable } from '../util/nullable';
import { Conversation } from '../conversation/conversation.entity';

export interface ConversationUserArgs {
  id: number;
  firstName: string;
  lastName: string;
  group: Nullable<any>;
  role: Role;
}

export class ConversationUser extends User {
  public readonly role: Role;

  constructor(params: ConversationUserArgs) {
    const { firstName, group, id, lastName, role } = params;
    super({ id, firstName, lastName, group, conversations: new Map() });
    this.role = role;
  }

  public get conversations(): undefined {
    return;
  }
}
