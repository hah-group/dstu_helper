import { Role } from '@prisma/client';
import { User, UserArgs } from './user.entity';

export interface ConversationUserArgs extends UserArgs {
  role: Role;
}

export class ConversationUser extends User {
  public readonly role: Role;

  constructor(params: ConversationUserArgs) {
    const { role } = params;
    super({ ...params });
    this.role = role;
  }
}
