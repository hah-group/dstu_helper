import { ConversationUser, ConversationUserArgs } from './conversation-user.entity';

export class ConversationUserFactory {
  public static create(params: ConversationUserArgs): ConversationUser {
    return new ConversationUser(params);
  }
}
