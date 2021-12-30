import { SetMetadata } from '@nestjs/common';
import { BOT_USER_ACCESSOR } from './bot-metadata.accessor';
import { UserStage } from '../../user/user-stage.enum';

export const IsUserStage = (stage: UserStage): MethodDecorator => SetMetadata(BOT_USER_ACCESSOR, stage);
