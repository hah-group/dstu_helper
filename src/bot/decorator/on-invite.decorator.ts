import { SetMetadata } from '@nestjs/common';

export const BOT_INVITE_LISTENER_METADATA = 'BOT_INVITE_LISTENER_METADATA';

export const OnInvite = (scope: 'user' | 'iam'): MethodDecorator => SetMetadata(BOT_INVITE_LISTENER_METADATA, scope);
