/*
import { StudyGroup } from '../../../old_modules/study-group/study-group.entity';
import { BotException } from '../bot.exception';
import { BotExceptionType } from './bot-exception-type.enum';

export class GroupUpdateInProgressException extends BotException {
  constructor(group: StudyGroup) {
    super({
      type: BotExceptionType.GROUP_UPDATE_IN_PROGRESS,
      notifyScope: 'USER',
      message: `Schedule updating for group ${group.id} in progress`,
      localizeMessage: {
        phrase: 'EXCEPTION_GROUP_UPDATE_IN_PROGRESS',
        replacements: {
          groupName: group.name,
        },
      },
    });
  }
}
*/
