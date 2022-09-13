import { Injectable } from '@nestjs/common';
import { OnMessage } from '../../framework/bot/decorator/on-message.decorator';
import { TextMessage } from '../../framework/bot/type/message.type';
import { UserService } from '../user/user.service';
import { UserStage } from '../user/user-stage.enum';
import { IsUserStage } from '../../framework/bot/decorator/is-user-stage.decorator';
import { DstuService } from 'src/old_modules/dstu/dstu.service';
import { StudyGroupFactory } from '../study-group/study-group.factory';
import { StudyGroupService } from '../study-group/study-group.service';
import { CacheService } from 'src/old_modules/cache/cache.service';
import { StudyGroup } from '../study-group/study-group.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InternalEvent } from '../util/internal-event.enum';
import { PrivateMainMenuKeyboard } from '../private-schedule/private-main-menu.keyboard';
import {
  SetupBotLanguageEnglishButton,
  SetupBotLanguageKeyboard,
  SetupBotLanguageRussianButton,
} from './setup-bot-language.keyboard';
import { TextProcessor } from '../util/text.processor';

@Injectable()
export class SetupBotHandler {
  constructor(
    private readonly userService: UserService,
    private readonly dstuService: DstuService,
    private readonly studyGroupService: StudyGroupService,
    private readonly cacheService: CacheService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /*@OnMessage('/start', 'private')
  public async start(message: TextMessage): Promise<void> {
    await message.send(TextProcessor.buildSimpleText('SETUP_STEP_CHOOSE_LANGUAGE'), SetupBotLanguageKeyboard);
    message.user.stage = UserStage.INPUT_LANGUAGE;
    await this.userService.save(message.user);
  }

  @OnMessage([SetupBotLanguageRussianButton, SetupBotLanguageEnglishButton], 'private')
  @IsUserStage(UserStage.INPUT_LANGUAGE)
  public async setLocale(message: TextMessage): Promise<void> {
    if (message.valueHandled == SetupBotLanguageRussianButton) message.user.locale = 'ru';
    else if (message.valueHandled == SetupBotLanguageEnglishButton) message.user.locale = 'en';
    else {
      //TODO Throw
      await message.send(TextProcessor.buildSimpleText('SETUP_STEP_INCORRECT_LOCALE'), SetupBotLanguageKeyboard);
      return;
    }

    await message.send(TextProcessor.buildSimpleText('SETUP_STEP_INPUT_GROUP'));

    message.user.stage = UserStage.INPUT_GROUP;
    await this.userService.save(message.user);
  }

  @OnMessage(undefined, 'private')
  @IsUserStage(UserStage.INPUT_GROUP)
  public async inputGroup(message: TextMessage): Promise<void> {
    await message.placeholder(TextProcessor.buildSimpleText('SETUP_STEP_SEARCH_GROUP'));
    const groupRawData = await this.dstuService.findGroup(message.text);
    if (!groupRawData) {
      await message.send(TextProcessor.buildSimpleText('SETUP_STEP_NOT_FOUND_GROUP'));
      return;
    }

    const group = StudyGroupFactory.createNew(groupRawData.id, groupRawData.name);
    group.addUser(message.user);
    await this.studyGroupService.save(group);

    message.user.stage = UserStage.DONE;
    await this.userService.save(message.user);

    await message.send(
      TextProcessor.buildSimpleText('SETUP_STEP_GROUP_FOUND', {
        groupName: group.name,
      }),
    );
    await this.requestSchedule(message, group);
  }

  public async requestSchedule(message: TextMessage, group: StudyGroup): Promise<void> {
    if (group.lessons.length < 1) {
      await message.placeholder(TextProcessor.buildSimpleText('SETUP_STEP_GETTING_SCHEDULE'));
      await this.cacheService.updateGroup(group);

      group.validate();
    }

    await message.send(TextProcessor.buildSimpleText('SETUP_STEP_SCHEDULE_READY'), PrivateMainMenuKeyboard, true);
    this.eventEmitter.emit(InternalEvent.SETUP_PRIVATE_SUCCESS, message);
  }*/
}
