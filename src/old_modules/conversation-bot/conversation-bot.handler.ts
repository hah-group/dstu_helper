import { Injectable, Logger } from '@nestjs/common';
import { OnInvite } from '../../framework/bot/decorator/on-invite.decorator';
import { InlineButtonMessage, InviteMessage, TextMessage } from '../../framework/bot/type/message.type';
import {
  AT_ACTIVATION,
  banWordsExits,
  LANG_ORDER,
  NEXT_AUDIENCE,
  ORDER_FIRST_LESSON_ACTIVATION,
  ORDER_LAST_LESSON_ACTIVATION,
  ORDER_LESSON_ACTIVATION,
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
import { OnInlineButton } from '../../framework/bot/decorator/on-inline-button.decorator';
import { VkService } from '../../framework/vk/vk.service';
import { OnMessage } from '../../framework/bot/decorator/on-message.decorator';
import { SocialSource } from '../../framework/bot/type/social.enum';
import { UserFactory } from '../user/user.factory';
import { Conversation } from '../conversation/conversation.entity';
import { BumpedGroupsResult, DstuService } from '../dstu/dstu.service';
import { StudyGroupFactory } from '../study-group/study-group.factory';
import { StudyGroupService } from '../study-group/study-group.service';
import { StudyGroup } from '../study-group/study-group.entity';
import { CacheService } from '../cache/cache.service';
import { DateParser } from '../util/date.parser';
import { GroupNotFoundException } from '../../framework/bot-exception/exception/group-not-found.exception';
import { Time } from '../util/time';
import { LanguageOrderDefinition } from '../util/definition/language-order.definition';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import * as lodash from 'lodash';
import { InternalEvent } from '../util/internal-event.enum';
import { delay } from '../util/delay';
import { BotContext } from '../../framework/bot/type/bot-context.type';
import { BotMessage } from '../../framework/bot/type/bot-message.type';
import { Text } from '../../framework/text/text';

@Injectable()
export class ConversationBotHandler {
  private readonly log = new Logger('ConversationBotHandler');

  constructor(
    private readonly conversationService: ConversationService,
    private readonly vkService: VkService,
    private readonly dstuService: DstuService,
    private readonly studyGroupService: StudyGroupService,
    private readonly cacheService: CacheService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnMessage(/test/gi)
  public async test(ctx: BotMessage): Promise<void> {
    await ctx.send(Text.Build('TEST', { Test: 'Тестовая строчка ❗️' }));
  }

  @OnEvent(InternalEvent.BROADCAST_BUMP_GROUP_COURSE_NOTIFICATION)
  public async broadcastGroupCourseBump(groups: BumpedGroupsResult[]): Promise<void> {
    this.log.log(`Start broadcast conversation notifications`);
    const conversations = await this.conversationService.getAll();
    this.log.log(`All conversations ${conversations.length}`);
    const groupsMap = lodash.keyBy(groups, (group) => group.group.id);
    this.log.log(`Updated groups ${groups.length}`);
    for (const conversation of conversations) {
      const conversationGroupsIds = conversation.groupsIds;
      const conversationGroups = lodash.compact(
        conversationGroupsIds.map((conversationGroupId) => groupsMap[conversationGroupId]),
      );
      this.log.log(`For conversation ${conversation.id} groups ${conversationGroups.length}`);
      if (conversationGroups.length < 1) continue;

      this.log.log(`Send bump notification for conversation ${conversation.id}`);
      //await this.vkService.sendMessageInQueue(conversation.id, TextProcessor.groupCourseBump(conversationGroups));

      this.log.log('Delay 500ms');
      await delay(500);
    }
  }

  @OnInvite('iam')
  public async onSelfInvite(message: InviteMessage): Promise<void> {
    this.log.log(`Invite to new conversation ${message.peerId}`);

    const conversation = ConversationFactory.createNew(message.peerId);
    conversation.addUser(message.fromUser, 'INVITING');
    await message.send(TextProcessor.buildSimpleText('ON_IAM_INVITE_START_TEXT'), ConversationBotCheckAdminKeyboard);
    await this.conversationService.save(conversation);
  }

  @OnMessage(/^\/сброс/gi, 'conversation')
  public async onReset(message: TextMessage): Promise<void> {
    if (message.from != SocialSource.VK) return;
    this.log.log(`Reset conversation ${message.peerId}`);

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
    /*if (message.from != SocialSource.VK) return;
    const conversation = await this.conversationService.get(message.peerId);

    if (!conversation.isMember(message.user) || !conversation.isInviting(message.user)) {
      await message.alert(TextProcessor.buildSimpleText('CONVERSATION_ADMIN_CHECK_DENIED'));
      return;
    }

    try {
      this.log.log(`Conversation init ${conversation.id}`);

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
    }*/
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

    const atDate = Time.get();
    await message.send(TextProcessor.lessons(group, atDate, false));
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

    let toGroup = await this.studyGroupService.getById(groupRawData.id);

    if (!toGroup) toGroup = StudyGroupFactory.createNew(groupRawData.id, groupRawData.name);

    this.log.log(`Change group in conversation ${message.peerId} to group ${toGroup.name}`);

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

    this.log.log(`Change group user ${message.user.id} to group ${toGroup.name}`);

    toGroup.addUser(message.user);

    await this.studyGroupService.save(toGroup);
    await this.requestSchedule(message, toGroup, false);
  }

  @OnMessage([SCHEDULE_ACTIVATION, WHAT_ACTIVATION, AT_ACTIVATION, WHOM_ACTIVATION], 'conversation')
  public async schedule(message: TextMessage): Promise<void> {
    if (message.from != SocialSource.VK) return;
    if (banWordsExits(message.text)) return;

    const group = await this.studyGroupService.getByUser(message.user);
    if (!group) throw new GroupNotFoundException(message.user);
    group.validate();

    this.log.log(`Request schedule in ${message.peerId} for group ${group.name}`);

    const atDate = DateParser.Parse(message.text);
    await message.send(TextProcessor.lessons(group, atDate, false));
  }

  @OnMessage(WHERE_AUDIENCE, 'conversation')
  public async currentLesson(message: TextMessage): Promise<void> {
    if (message.from != SocialSource.VK) return;

    const group = await this.studyGroupService.getByUser(message.user);
    if (!group) throw new GroupNotFoundException(message.user);
    group.validate();

    this.log.log(`Request audience in ${message.peerId} for group ${group.name}`);

    await message.send(TextProcessor.short(group, true));
  }

  @OnMessage(NEXT_AUDIENCE, 'conversation')
  public async nextLesson(message: TextMessage): Promise<void> {
    if (message.from != SocialSource.VK) return;
    if (!message.user.groupIsInitialized()) return;

    const group = await this.studyGroupService.getByUser(message.user);
    if (!group) throw new GroupNotFoundException(message.user);
    group.validate();

    this.log.log(`Request next audience in ${message.peerId} for group ${group.name}`);

    await message.send(TextProcessor.short(group, false));
  }

  @OnMessage(ORDER_LESSON_ACTIVATION, 'conversation')
  public async orderLesson(message: TextMessage): Promise<void> {
    if (message.from != SocialSource.VK) return;
    if (!message.user.groupIsInitialized()) return;

    const group = await this.studyGroupService.getByUser(message.user);
    if (!group) throw new GroupNotFoundException(message.user);
    group.validate();

    const orderMatch = message.text.match(/\d/);
    let order: number | undefined;

    if (orderMatch) {
      order = parseInt(orderMatch[0]);
    } else {
      const langOrderMatch = message.text.match(LANG_ORDER);
      order = LanguageOrderDefinition[langOrderMatch[0] || ''];
    }

    if (!order) return;

    this.log.log(`Request order audience ${order} in ${message.peerId} for group ${group.name}`);

    await message.send(TextProcessor.order(group, order));
  }

  @OnMessage(ORDER_LAST_LESSON_ACTIVATION, 'conversation')
  public async orderLastLesson(message: TextMessage): Promise<void> {
    if (message.from != SocialSource.VK) return;
    if (!message.user.groupIsInitialized()) return;

    const group = await this.studyGroupService.getByUser(message.user);
    if (!group) throw new GroupNotFoundException(message.user);
    group.validate();

    this.log.log(`Request order last audience in ${message.peerId} for group ${group.name}`);

    await message.send(TextProcessor.order(group, -1));
  }

  @OnMessage(ORDER_FIRST_LESSON_ACTIVATION, 'conversation')
  public async orderFirstLesson(message: TextMessage): Promise<void> {
    if (message.from != SocialSource.VK) return;
    if (!message.user.groupIsInitialized()) return;

    const group = await this.studyGroupService.getByUser(message.user);
    if (!group) throw new GroupNotFoundException(message.user);
    group.validate();

    this.log.log(`Request order last audience in ${message.peerId} for group ${group.name}`);

    const atDate = DateParser.Parse(message.text);
    await message.send(TextProcessor.order(group, 0, atDate));
  }

  @OnInvite('user')
  public async onUserInvite(message: InviteMessage): Promise<void> {
    //TODO Fix conversation group
    if (message.from != SocialSource.VK) return;
    if (!message.fromUser.groupIsInitialized()) return;

    const group = await this.studyGroupService.getByUser(message.fromUser);
    if (group) {
      if (message.invitedUser && !message.invitedUser.groupId) group.addUser(message.invitedUser);

      this.log.log(`New user in conversation ${message.peerId}, set group ${group.name}`);

      await this.studyGroupService.save(group);
    }
  }
}
