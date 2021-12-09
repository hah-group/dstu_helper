import { SetMetadata } from '@nestjs/common';

export const BOT_MESSAGE_LISTENER_METADATA = 'BOT_MESSAGE_LISTENER_METADATA';

/**
 * `@OnMessage` decorator metadata
 */
export interface OnMessageMetadata {
  /**
   * Message (string or pattern) to subscribe to.
   */
  event?: string | RegExp | string[] | RegExp[];

  scope?: 'conversation' | 'private' | 'all';
}

/**
 * Message listener decorator.
 * Subscribes to bot messages
 *
 * @param event
 * @param scope
 */
export const OnMessage = (
  event?: string | RegExp | string[] | RegExp[],
  scope?: 'conversation' | 'private' | 'all',
): MethodDecorator => SetMetadata(BOT_MESSAGE_LISTENER_METADATA, { event, scope } as OnMessageMetadata);
