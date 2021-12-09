import { SetMetadata } from '@nestjs/common';

export const BOT_PAYLOAD_LISTENER_METADATA = 'BOT_PAYLOAD_LISTENER_METADATA';

export const OnPayload = (type: string): MethodDecorator => SetMetadata(BOT_PAYLOAD_LISTENER_METADATA, type);
