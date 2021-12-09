import { Role } from '@prisma/client';
import { Conversation, ConversationArgs } from '../conversation/conversation.entity';

export interface UserConversationArgs extends Omit<ConversationArgs, 'users'> {
  role: Role;
}

export class UserConversation extends Conversation {
  public readonly role: Role;

  constructor(params: UserConversationArgs) {
    const { role } = params;
    super({ ...params, users: new Map() });
    this.role = role;
  }

  public get users(): undefined {
    return;
  }
}
