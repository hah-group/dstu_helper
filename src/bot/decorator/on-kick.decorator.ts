import { SetMetadata } from '@nestjs/common';

export const BOT_KICK_LISTENER_METADATA = 'BOT_KICK_LISTENER_METADATA';

export const OnKick = (): MethodDecorator => SetMetadata(BOT_KICK_LISTENER_METADATA, true);
