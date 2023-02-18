import {
  BotEditableMessage,
  BotInlineMessage,
  BotMessage,
  Content,
  KeyboardBuilder,
  OnInlineButton,
  OnInvite,
  OnMessage,
  SceneParams,
  SceneService,
} from '@dstu_helper/common';
import { Injectable, Logger } from '@nestjs/common';

import { ConversationEntity } from '../../conversation/conversation.entity';
import { ConversationRepository } from '../../conversation/conversation.repository';
import { GroupService } from '../../schedule/group/group.service';
import { ChangeGroupConfirmButton, ChangeGroupConfirmKeyboard } from './keyboard/change-group-confirm.keyboard';

//TODO Add abstraction for different university
const GROUP_CHANGE_REGEX = /^\/группа ([a-zа-я\d\- ]*)/i;

@Injectable()
export class ConversationSetupHandler {
  private readonly log = new Logger('ConversationSetupHandler');

  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly sceneService: SceneService,
    private readonly groupService: GroupService,
  ) {}

  @OnInvite('iam')
  public async onInvite(message: BotMessage): Promise<void> {
    this.log.log(`Invited to new conversation (${message.provider}: ${message.chat.id})`);
    const conversation = await this.conversationRepository.getById(message.chat.id, message.provider);
    if (!conversation) {
      const newConversation = new ConversationEntity();
      newConversation.externalId = message.chat.id;
      newConversation.provider = message.provider;
      await this.conversationRepository.save(newConversation);
      await message.send(Content.Build('conversation-hello', { provider: message.provider }));
    } else {
      await message.send(
        Content.Build('conversation-comeback-hello', {
          provider: message.provider,
          defaultGroup: await conversation.defaultGroup,
        }),
      );
    }
  }

  @OnMessage(/^\/группа[\n ]*$/im, 'conversation')
  public async onIncorrectChangeGroup(message: BotMessage): Promise<void> {
    await message.send(Content.Build('change-group-incorrect'));
  }

  @OnMessage(GROUP_CHANGE_REGEX, 'conversation')
  public async onChangeGroup(message: BotMessage): Promise<void> {
    const match = message.payload.text.match(GROUP_CHANGE_REGEX);
    if (!match || !match[1]) {
      await message.send(Content.Build('change-group-searching', { state: 'failed' }));
      return;
    }

    const muteWarning = await this.sceneService.get({
      provider: message.provider,
      chatId: message.chat.id,
      name: 'MUTE_CHANGE_GROUP_WARNING',
    });

    const conversation = await this.conversationRepository.getById(message.chat.id, message.provider);
    if (!conversation) throw new Error('Conversation not found');

    if (!muteWarning && conversation.defaultGroup) {
      await message.send(Content.Build('change-group-warning'), ChangeGroupConfirmKeyboard);
      await this.sceneService.set(
        {
          provider: message.provider,
          chatId: message.chat.id,
          name: 'CHANGE_GROUP_WARNING',
        },
        {
          groupName: match[1],
          userId: message.from.id,
        },
        180, //3 minutes
      );
    } else return this.changeGroup(message, match[1]);
  }

  @OnInlineButton(ChangeGroupConfirmButton)
  public async onChangeGroupConfirm(message: BotInlineMessage): Promise<void> {
    const sceneParams: SceneParams = {
      provider: message.provider,
      chatId: message.chat.id,
      name: 'CHANGE_GROUP_WARNING',
    };
    const sceneValue = await this.sceneService.get(sceneParams);
    if (!sceneValue) {
      await message.alert(Content.Build('change-group-timeout'));
      return;
    } else if (sceneValue.userId != message.from.id) {
      await message.alert(Content.Build('change-group-invalid-user'));
    }
    await this.sceneService.remove(sceneParams);
    await message.edit(Content.Build('change-group-warning'), new KeyboardBuilder());

    return this.changeGroup(message, sceneValue.groupName, sceneParams);
  }

  private async changeGroup(message: BotEditableMessage, groupName: string, sceneParams?: SceneParams): Promise<void> {
    const group = await this.groupService.findGroup(groupName);

    const warning = await this.sceneService.get({
      provider: message.provider,
      chatId: message.chat.id,
      name: 'MUTE_CHANGE_GROUP_WARNING',
    });
    if (!warning) {
      await this.sceneService.set(
        {
          provider: message.provider,
          chatId: message.chat.id,
          name: 'MUTE_CHANGE_GROUP_WARNING',
        },
        { mute: true },
        180, // Turn off group change notification for 3 minutes
      );
    }

    const action = sceneParams ? message.edit : message.send;

    if (!group) {
      await action(Content.Build('change-group-searching', { state: 'failed' }));
    } else {
      const conversation = await this.conversationRepository.getById(message.chat.id, message.provider);
      if (!conversation) throw new Error('Conversation not found');

      await conversation.updateGroup(group);
      await this.conversationRepository.save(conversation);
      if (sceneParams) await this.sceneService.remove(sceneParams);

      await action(Content.Build('change-group-searching', { state: 'success' }));
    }
  }
}
