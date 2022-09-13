import { Injectable, Logger } from '@nestjs/common';
import { OnInvite } from '../../../framework/bot/decorator/on-invite.decorator';
import { BotMessage } from '../../../framework/bot/type/bot-message.type';
import { Text } from '../../../framework/text/text';
import { OnMessage } from '../../../framework/bot/decorator/on-message.decorator';

@Injectable()
export class ConversationSetupHandler {
  private readonly log = new Logger('ConversationSetupHandler');

  @OnMessage('1')
  public async onInvite(message: BotMessage): Promise<void> {
    this.log.log(`Invited to new conversation (${message.provider}: ${message.chat.id})`);
    await message.send(Text.Build('conversation-hello', { provider: message.provider }));
  }

  @OnMessage(/^\/группа/, 'conversation')
  public async onChangeGroup(message: BotMessage): Promise<void> {
    console.log(message.from.user);
    this.log.log('');
  }
}
