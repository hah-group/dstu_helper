import { Injectable } from '@nestjs/common';
import { OnInvite } from '../bot/decorator/on-invite.decorator';
import { InlineButtonMessage, InviteMessage, TextMessage } from '../bot/type/message.type';
import {
  AT_ACTIVATION,
  banWordsExits,
  NEXT_AUDIENCE,
  SCHEDULE_ACTIVATION,
  TextProcessor,
  WHAT_ACTIVATION,
  WHERE_AUDIENCE,
  WHOM_ACTIVATION,
} from '../util/text.processor';
import { ConversationFactory } from '../conversation/conversation.factory';
import { ConversationService } from '../conversation/conversation.service';
import {
  ConversationBotCheckAdminButton,
  ConversationBotCheckAdminKeyboard,
} from './conversation-bot-check-admin.keyboard';
import { OnInlineButton } from '../bot/decorator/on-inline-button.decorator';
import { VkService } from '../vk/vk.service';
import { OnMessage } from '../bot/decorator/on-message.decorator';
import { SocialSource } from '../bot/type/social.enum';
import { UserFactory } from '../user/user.factory';
import { Conversation } from '../conversation/conversation.entity';
import { DstuService } from '../dstu/dstu.service';
import { StudyGroupFactory } from '../study-group/study-group.factory';
import { StudyGroupService } from '../study-group/study-group.service';
import { StudyGroup } from '../study-group/study-group.entity';
import { CacheService } from '../cache/cache.service';
import { DateParser } from '../util/date.parser';

@Injectable()
export class ConversationBotHandler {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly vkService: VkService,
    private readonly dstuService: DstuService,
    private readonly studyGroupService: StudyGroupService,
    private readonly cacheService: CacheService,
  ) {}

  @OnInvite('iam')
  public async onSelfInvite(message: InviteMessage): Promise<void> {
    const conversation = ConversationFactory.createNew(message.peerId);
    conversation.addUser(message.fromUser, 'INVITING');
    await message.send(TextProcessor.buildSimpleText('ON_IAM_INVITE_START_TEXT'), ConversationBotCheckAdminKeyboard);
    await this.conversationService.save(conversation);
  }

  @OnMessage(/^\/сброс/gi, 'conversation')
  public async onReset(message: TextMessage): Promise<void> {
    if (message.from != SocialSource.VK) return;

    const conversation = await this.conversationService.get(message.peerId);
    if (conversation) {
      if (!conversation.isAccessToSettings(message.user)) {
        await message.send(TextProcessor.buildSimpleText('CONVERSATION_RESET_DATA_DENIED'));
        return;
      }

      conversation.reset();
      await this.conversationService.save(conversation);
    } else {
      const conversation = ConversationFactory.createNew(message.peerId);
      conversation.addUser(message.user, 'INVITING');
      await this.conversationService.save(conversation);
    }

    await message.send(TextProcessor.buildSimpleText('ON_IAM_INVITE_START_TEXT'), ConversationBotCheckAdminKeyboard);
  }

  @OnInlineButton(ConversationBotCheckAdminButton)
  public async onCheckAdmin(message: InlineButtonMessage): Promise<void> {
    if (message.from != SocialSource.VK) return;
    const conversation = await this.conversationService.get(message.peerId);

    if (!conversation.isMember(message.user) || !conversation.isInviting(message.user)) {
      await message.alert(TextProcessor.buildSimpleText('CONVERSATION_ADMIN_CHECK_DENIED'));
      return;
    }

    try {
      const result = await this.vkService.getConversationInfo(message.peerId);
      await message.alert(TextProcessor.buildSimpleText('CONVERSATION_ADMIN_CHECK_SUCCESS'));
      await message.edit(TextProcessor.buildSimpleText('CONVERSATION_START_INIT'));

      conversation.title = result.chat.title;

      const adminIds = result.chat.admin_ids;
      for (const profile of result.profiles) {
        const user = UserFactory.createNew(profile.id, profile.first_name, profile.last_name, message.from);
        const isAdmin = adminIds.some((adminId) => adminId == profile.id);

        conversation.addUser(user, isAdmin ? 'ADMIN' : 'STUDENT');
      }

      await this.conversationService.save(conversation);
      await this.findGroup(message, conversation);
    } catch (e) {
      await message.alert(TextProcessor.buildSimpleText('CONVERSATION_ADMIN_CHECK_FAILED'));
    }
  }

  public async findGroup(message: InlineButtonMessage, conversation: Conversation): Promise<void> {
    await message.send(TextProcessor.buildSimpleText('CONVERSATION_START_FIND_GROUP'));

    const prettyGroupTitle = conversation.title.match(/([а-я]+[ \-]*\d{2})/gi);
    const groupRawData = await this.dstuService.findGroup(prettyGroupTitle ? prettyGroupTitle[0] : conversation.title);
    if (!groupRawData) {
      await message.send(TextProcessor.buildSimpleText('CONVERSATION_FIND_GROUP_FAILED'));
      return;
    }

    let group = await this.studyGroupService.getById(groupRawData.id);

    if (!group) {
      group = StudyGroupFactory.createNew(groupRawData.id, groupRawData.name);
    }

    for (const conversationUser of conversation.users) {
      group.addUser(conversationUser);
    }

    conversation.status = 'FULL';
    await this.studyGroupService.save(group);
    await this.conversationService.save(conversation);

    await this.requestSchedule(message, group);
  }

  public async requestSchedule(
    message: InlineButtonMessage | TextMessage,
    group: StudyGroup,
    setup = true,
  ): Promise<void> {
    if (group.lessons.length < 1) {
      await message.send(TextProcessor.buildSimpleText('CONVERSATION_GETTING_SCHEDULE'));
      await this.cacheService.updateGroup(group);
    }

    await message.send(TextProcessor.buildSimpleText(setup ? 'CONVERSATION_SCHEDULE_READY' : 'SCHEDULE_READY'));
  }

  @OnMessage(/^\/группа [а-я]+[ \-,.]*\d{2}/gi, 'conversation')
  public async changeGroup(message: TextMessage): Promise<void> {
    if (message.from != SocialSource.VK) return;

    const conversation = await this.conversationService.get(message.peerId);
    if (!conversation.isAccessToSettings(message.user)) {
      await message.send(TextProcessor.buildSimpleText('CONVERSATION_CHANGE_GROUP_DENIED'));
      return;
    }

    const groupName = message.text.match(/([а-я]+[ \-.,]*\d{2})/gi);
    if (!groupName) {
      await message.send(TextProcessor.buildSimpleText('CONVERSATION_CHANGE_GROUP_FAILED'));
      return;
    }

    const groupRawData = await this.dstuService.findGroup(groupName[0]);
    if (!groupRawData) {
      await message.send(TextProcessor.buildSimpleText('CONVERSATION_CHANGE_GROUP_FAILED'));
      return;
    }

    const conversation = await this.conversationService.get(message.peerId);
    let toGroup = await this.studyGroupService.getById(groupRawData.id);

    if (!toGroup) toGroup = StudyGroupFactory.createNew(groupRawData.id, groupRawData.name);

    for (const conversationUser of conversation.users) {
      toGroup.addUser(conversationUser);
    }

    await this.studyGroupService.save(toGroup);
    await this.requestSchedule(message, toGroup, false);
  }

  @OnMessage(/^\/моя группа [а-я]+[ \-,.]*\d{2}/gi, 'conversation')
  public async changeMyGroup(message: TextMessage): Promise<void> {
    if (message.from != SocialSource.VK) return;

    const groupName = message.text.match(/([а-я]+[ \-.,]*\d{2})/gi);
    if (!groupName) {
      await message.send(TextProcessor.buildSimpleText('CONVERSATION_CHANGE_GROUP_FAILED'));
      return;
    }

    const groupRawData = await this.dstuService.findGroup(groupName[0]);
    if (!groupRawData) {
      await message.send(TextProcessor.buildSimpleText('CONVERSATION_CHANGE_GROUP_FAILED'));
      return;
    }

    let toGroup = await this.studyGroupService.getById(groupRawData.id);

    if (!toGroup) toGroup = StudyGroupFactory.createNew(groupRawData.id, groupRawData.name);

    toGroup.addUser(message.user);

    await this.studyGroupService.save(toGroup);
    await this.requestSchedule(message, toGroup, false);
  }

  @OnMessage([SCHEDULE_ACTIVATION, WHAT_ACTIVATION, AT_ACTIVATION, WHOM_ACTIVATION], 'conversation')
  public async schedule(message: TextMessage): Promise<void> {
    if (!message.user.groupIsInitialized()) return;

    if (banWordsExits(message.text)) return;

    const group = await this.studyGroupService.getByUser(message.user);
    if (!group) throw new Error('Not found group');
    group.validate();

    const atDate = DateParser.Parse(message.text);
    await message.send(TextProcessor.lessons(group, atDate, false));
  }

  @OnMessage(WHERE_AUDIENCE, 'conversation')
  public async currentLesson(message: TextMessage): Promise<void> {
    if (!message.user.groupIsInitialized()) return;

    const group = await this.studyGroupService.getByUser(message.user);
    if (!group) throw new Error('Not found group');
    group.validate();

    await message.send(TextProcessor.short(group, true));
  }

  @OnMessage(NEXT_AUDIENCE, 'conversation')
  public async nextLesson(message: TextMessage): Promise<void> {
    if (!message.user.groupIsInitialized()) return;

    const group = await this.studyGroupService.getByUser(message.user);
    if (!group) throw new Error('Not found group');
    group.validate();

    await message.send(TextProcessor.short(group, false));
  }

  @OnInvite('user')
  public async onUserInvite(message: InviteMessage): Promise<void> {
    if (!message.fromUser.groupIsInitialized()) return;

    const group = await this.studyGroupService.getByUser(message.fromUser);
    if (!group) throw new Error('Not found group');

    if (message.invitedUser && !message.invitedUser.groupId) group.addUser(message.invitedUser);

    await this.studyGroupService.save(group);
  }
}
