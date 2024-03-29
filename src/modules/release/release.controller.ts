import { Controller, Get } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as lodash from 'lodash';
import { Text } from '../../framework/text/text';
import { ConversationRepository } from '../conversation/conversation.repository';

@Controller('release')
export class ReleaseController {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly conversationRepository: ConversationRepository,
  ) {}

  @Get('send')
  public async send(): Promise<void> {
    const conversations = await this.conversationRepository.findAll({});
    this.eventEmitter.emit('broadcast', {
      provider: 'vk',
      targetIds: lodash.compact(
        conversations.map((conversation) => (conversation.provider == 'vk' ? conversation.externalId : null)),
      ),
      message: Text.Build('release-schedule-private'),
    });
  }
}
