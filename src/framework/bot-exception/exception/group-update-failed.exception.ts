/*
import { StudyGroup } from '../../../old_modules/study-group/study-group.entity';
import { BotException } from '../bot.exception';
import { BotExceptionType } from './bot-exception-type.enum';

export class GroupUpdateFailedException extends BotException {
  constructor(group: StudyGroup) {
    super({
      type: BotExceptionType.GROUP_UPDATE_FAILED,
      notifyScope: 'ALL',
      text: `Schedule updating for group ${group.key} failed`,
      localizeMessage: {
        phrase: 'EXCEPTION_GROUP_UPDATE_FAILED',
        replacements: {
          groupName: group.name,
        },
      },
      data: {
        group: group.key,
        status: group.updateStatus,
      },
    });
  }
}
*/
