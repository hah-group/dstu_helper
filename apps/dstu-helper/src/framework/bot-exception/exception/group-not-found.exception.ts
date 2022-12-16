import { BotException } from '../bot.exception';
import { BotExceptionType } from './bot-exception-type.enum';
import { UserEntity } from '../../../modules/user/user.entity';

export class GroupNotFoundException extends BotException {
  constructor(user: UserEntity) {
    super({
      type: BotExceptionType.GROUP_NOT_FOUND,
      notifyScope: 'USER',
      message: `Group for user ${user.id} not found`,
      localizeMessage: {
        phrase: 'EXCEPTION_GROUP_NOT_FOUND',
      },
    });
  }
}
