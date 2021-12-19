import { Injectable } from '@nestjs/common';
import { OnMessage } from './decorator/on-message.decorator';
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
import { BotMessage } from './type/bot-message.type';
import { BotAnyResponse } from './type/bot-response.type';
import { UserService } from '../user/user.service';
import { StudyGroupService } from '../study-group/study-group.service';
import { DateParser } from '../util/date.parser';

@Injectable()
export class ScheduleHandler {
  constructor(private readonly userService: UserService, private readonly studyGroupService: StudyGroupService) {}

  @OnMessage([SCHEDULE_ACTIVATION, WHAT_ACTIVATION, AT_ACTIVATION, WHOM_ACTIVATION])
  public async simpleSchedule(message: BotMessage): Promise<BotAnyResponse> {
    if (message.text.split(' ').length > 10) return;
    if (banWordsExits(message.text)) return;

    const user = await this.userService.get(message.from_id);
    if (user.groupId) {
      const group = await this.studyGroupService.getByUser(user);
      const date = DateParser.Parse(message.text);
      return {
        type: 'message',
        text: TextProcessor.lessons(group, date),
      };
    }
  }

  @OnMessage(WHERE_AUDIENCE)
  public async currentLesson(message: BotMessage): Promise<BotAnyResponse> {
    if (message.text.split(' ').length > 10) return;
    if (banWordsExits(message.text)) return;

    const user = await this.userService.get(message.from_id);
    if (user.groupId) {
      const group = await this.studyGroupService.getByUser(user);
      const date = DateParser.Parse(message.text);
      return {
        type: 'message',
        text: TextProcessor.short(group, true),
      };
    }
  }

  @OnMessage(NEXT_AUDIENCE)
  public async nextLesson(message: BotMessage): Promise<BotAnyResponse> {
    if (message.text.split(' ').length > 10) return;
    if (banWordsExits(message.text)) return;

    const user = await this.userService.get(message.from_id);
    if (user.groupId) {
      const group = await this.studyGroupService.getByUser(user);
      return {
        type: 'message',
        text: TextProcessor.short(group, false),
      };
    }
  }

  @OnMessage('/change_group')
  public async changeGroup(message: BotMessage): Promise<BotAnyResponse> {
    const user = await this.userService.get(message.from_id);
    if (user.groupId == 41769) user.groupId = 40222;
    else if (user.groupId == 40222) user.groupId = 41769;

    await this.userService.save(user);

    return;
  }
}
