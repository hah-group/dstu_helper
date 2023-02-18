import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConversationEntity } from './conversation.entity';
import { ConversationRepository } from './conversation.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ConversationEntity])],
  providers: [ConversationRepository],
  exports: [ConversationRepository],
})
export class ConversationModule {}
