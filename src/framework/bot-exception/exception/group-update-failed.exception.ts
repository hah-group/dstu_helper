import { StudyGroup } from '../../../old_modules/study-group/study-group.entity';
import { BotException } from '../bot.exception';
import { BotExceptionType } from './bot-exception-type.enum';

export class GroupUpdateFailedException extends BotException {
  constructor(group: StudyGroup) {
    super({
      type: BotExceptionType.GROUP_UPDATE_FAILED,
      notifyScope: 'ALL',
      message: `Schedule updating for group ${group.id} failed`,
      localizeMessage: {
        phrase: 'EXCEPTION_GROUP_UPDATE_FAILED',
        replacements: {
          groupName: group.name,
        },
      },
      data: {
        group: group.id,
        status: group.updateStatus,
      },
    });
  }
}
