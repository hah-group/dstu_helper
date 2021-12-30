import { SetMetadata } from '@nestjs/common';
import { OnInviteMetadata } from './handler-metadata.type';
import { EventType } from '../type/metadata-type.enum';
import { BOT_HANDLER } from './bot-metadata.accessor';

export const OnInvite = (scope: 'iam' | 'user'): MethodDecorator =>
  SetMetadata(BOT_HANDLER, { type: EventType.ON_INVITE, scope: scope } as OnInviteMetadata);
