import { Module } from '@nestjs/common';
import { ConversationRepository } from './conversation.repository';
import { ConversationEntity } from './conversation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ConversationEntity])],
  providers: [ConversationRepository],
  exports: [ConversationRepository],
})
export class ConversationModule {}
