import { Injectable } from '@nestjs/common';
import { BotAnyResponse, BotResponse } from './type/bot-response.type';
import { HELLO_CONVERSATION_MESSAGE } from '../util/text/setup.text';
import { ConversationService } from '../conversation/conversation.service';
import { BotEvent, BotMessage } from './type/bot-message.type';
import { ConversationFactory } from '../conversation/conversation.factory';
import { UserService } from '../user/user.service';
import { OnInvite } from './decorator/on-invite.decorator';
import { CheckAdminKeyboard, INLINE_BUTTON_CHECK_ADMIN } from '../util/keyboard/check-admin.keyboard';
import { OnPayload } from './decorator/on-payload.decorator';
import { BotService } from './bot.service';
import { OnMessage } from './decorator/on-message.decorator';
import { UserFactory } from '../user/user.factory';
import { BotLinkKeyboard } from '../util/keyboard/bot-link.keyboard';
import { Conversation } from '../conversation/conversation.entity';
import { UniversityService } from '../university/university.service';
import { UniversityName } from '../university/university-name.enum';
import { StudyGroupFactory } from '../study-group/study-group.factory';
import { StudyGroupService } from 'src/study-group/study-group.service';
import { CacheService } from 'src/cache/cache.service';

@Injectable()
export class SetupHandler {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly userService: UserService,
    private readonly botService: BotService,
    private readonly universityService: UniversityService,
    private readonly studyGroupService: StudyGroupService,
    private readonly cacheService: CacheService,
  ) {}
  @OnInvite('iam')
  @OnMessage('/invite_event', 'conversation')
  public async addToConversation(message: BotMessage): Promise<BotResponse> {
    const conversation = ConversationFactory.createNew(message.peer_id);
    const user = await this.userService.get(message.from_id);

    conversation.addUser(user, 'ADMIN');

    await this.conversationService.save(conversation);
    return {
      type: 'message',
      text: HELLO_CONVERSATION_MESSAGE,
      keyboard: CheckAdminKeyboard(message.peer_id),
    };
  }

  @OnPayload(INLINE_BUTTON_CHECK_ADMIN)
  public async checkConversationAdmin(message: BotEvent): Promise<BotAnyResponse> {
    const conversation = await this.conversationService.get(message.peerId);
    const user = await this.userService.get(message.userId);
    if (!conversation.isAdmin(user)) {
      return {
        type: 'event',
        text: 'Ты не админ',
      };
    }
    try {
      const info = await this.botService.getConversationInfo(conversation.id);
      conversation.title = info.chat.title;

      info.chat.active_ids.forEach((activeId) => {
        const profileInfo = info.profiles.find((record) => record.id == activeId);
        if (profileInfo) {
          const { first_name, id, last_name } = profileInfo;
          const user = UserFactory.createNew(id, first_name, last_name);
          const isAdmin = info.chat.admin_ids.includes(id);
          conversation.addUser(user, isAdmin ? 'ADMIN' : 'STUDENT');
        }
      });
    } catch (e) {
      return {
        type: 'event',
        text: 'Нет админки',
      };
    }

    conversation.status = 'FULL';
    await this.conversationService.save(conversation);

    await message.edit(
      'Получена. Меня можно настроить, если нада - прошу в лс (Может только пригласивший или админы беседы',
      BotLinkKeyboard,
    );

    return this.findGroup(message, conversation);
  }

  private async findGroup(message: BotEvent, conversation: Conversation): Promise<BotAnyResponse> {
    await message.placeholder('Сейчас попытаюсь найти вашу группу...');
    const group = await this.universityService.findGroup(conversation.title, UniversityName.DSTU);
    if (group) {
      const studyGroup = StudyGroupFactory.createNew(group.id, group.name);
      conversation.users.forEach((user) => studyGroup.addUser(user));
      await this.studyGroupService.save(studyGroup);
      await message.placeholder(
        `Отлично, я нашел твою группу: ${studyGroup.name}. Если нет, иди на хуй. Получаю расписание...`,
      );
      await this.cacheService.updateGroup(studyGroup);
      return {
        type: 'message',
        text: 'Расписание получено, бот готов к работе',
      };
    } else {
      return {
        type: 'message',
        text: `Мне не удалось найти твою группу, иди на хуй`,
      };
    }
  }
}
