import { Injectable } from '@nestjs/common';
import { BotResponse } from './type/bot-response.type';
import { HELLO_CONVERSATION_MESSAGE } from '../util/text/setup.text';
import { BotLinkKeyboard } from '../util/keyboard/bot-link.keyboard';
import { OnMessage } from './decorator/on-message.decorator';
import { ConversationService } from '../conversation/conversation.service';
import { BotMessage } from './type/bot-message.type';
import { ConversationFactory } from '../conversation/conversation.factory';
import { UserService } from '../user/user.service';
import { UserConversationFactory } from '../user/user-conversation.factory';
import { Role } from '@prisma/client';
import { OnInvite } from './decorator/on-invite.decorator';

@Injectable()
export class SetupHandler {
  constructor(private readonly conversationService: ConversationService, private readonly userService: UserService) {}
  @OnInvite('iam')
  public async addToConversation(message: BotMessage): Promise<BotResponse> {
    const conversation = ConversationFactory.createNew(message.peer_id);

    const user = await this.userService.get(message.from_id);
    const userConversation = UserConversationFactory.createNew(Role.ADMIN, conversation);
    user.addToConversation(userConversation);

    await this.userService.save(user);
    return {
      type: 'text',
      text: HELLO_CONVERSATION_MESSAGE,
      keyboard: BotLinkKeyboard,
    };
  }
}
