import { Injectable, Logger } from '@nestjs/common';
import { OnInvite } from '../../../framework/bot/decorator/on-invite.decorator';
import { BotAnyMessage, BotInlineMessage, BotMessage } from '../../../framework/bot/type/bot-message.type';
import { Text } from '../../../framework/text/text';
import { OnMessage } from '../../../framework/bot/decorator/on-message.decorator';
import { ScheduleService } from 'src/modules/schedule/schedule.service';
import { GroupEntity } from '../../group/group.entity';
import { ConversationRepository } from '../../conversation/conversation.repository';
import { ConversationEntity } from '../../conversation/conversation.entity';
import { KeyboardBuilder } from '../../../framework/bot/keyboard/keyboard.builder';
import { OnInlineButton } from '../../../framework/bot/decorator/on-inline-button.decorator';
import { SceneParams, SceneService } from 'src/framework/scene/scene.service';
import { ChangeGroupConfirmButton, ChangeGroupConfirmKeyboard } from './keyboard/change-group-confirm.keyboard';

//TODO Add abstraction for different university
const GROUP_CHANGE_REGEX = /^\/группа ([a-zа-я\d\- ]*)/i;

@Injectable()
export class ConversationSetupHandler {
  private readonly log = new Logger('ConversationSetupHandler');

  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly conversationRepository: ConversationRepository,
    private readonly sceneService: SceneService,
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
      await message.send(Text.Build('conversation-hello', { provider: message.provider }));
    } else {
      await message.send(
        Text.Build('conversation-comeback-hello', {
          provider: message.provider,
          defaultGroup: conversation.defaultGroup,
        }),
      );
    }
  }

  @OnMessage(/^\/группа[\n ]*$/im, 'conversation')
  public async onIncorrectChangeGroup(message: BotMessage): Promise<void> {
    await message.send(Text.Build('change-group-incorrect'));
  }

  @OnMessage(GROUP_CHANGE_REGEX, 'conversation')
  public async onChangeGroup(message: BotMessage): Promise<void> {
    const match = message.payload.text.match(GROUP_CHANGE_REGEX);
    if (!match || !match[1]) {
      await message.send(Text.Build('change-group-searching', { state: 'failed' }));
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
      await message.send(Text.Build('change-group-warning'), ChangeGroupConfirmKeyboard);
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
      await message.alert(Text.Build('change-group-timeout'));
      return;
    } else if (sceneValue.userId != message.from.id) {
      await message.alert(Text.Build('change-group-invalid-user'));
    }
    await this.sceneService.remove(sceneParams);
    await message.edit(Text.Build('change-group-warning'), new KeyboardBuilder());

    //TODO Add types for scene value
    return this.changeGroup(message, sceneValue.groupName, sceneParams);
  }

  private async changeGroup(message: BotAnyMessage, groupName: string, sceneParams?: SceneParams): Promise<void> {
    await message.send(Text.Build('change-group-searching', { state: 'loading' }));
    const group = await this.scheduleService.findGroup(groupName, message.universityName);

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

    if (!group) {
      await message.send(Text.Build('change-group-searching', { state: 'failed' }));
    } else {
      const conversation = await this.conversationRepository.getById(message.chat.id, message.provider);
      if (!conversation) throw new Error('Conversation not found');

      await conversation.updateGroup(group);
      await this.conversationRepository.save(conversation);
      if (sceneParams) await this.sceneService.remove(sceneParams);

      return this.getSchedule(message, group);
    }
  }

  private async getSchedule(message: BotAnyMessage, group: GroupEntity): Promise<void> {
    await message.send(Text.Build('schedule-loading', { state: 'loading' }));
    await this.scheduleService.updateSchedule(group.university.name, group.externalId);
    await message.send(Text.Build('schedule-loading', { state: 'done' }));
  }
}
