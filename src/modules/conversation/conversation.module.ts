import { Module } from '@nestjs/common';
import { ConversationRepository } from './conversation.repository';
import { ConversationEntity } from './conversation.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [MikroOrmModule.forFeature([ConversationEntity])],
  providers: [ConversationRepository],
  exports: [ConversationRepository],
})
export class ConversationModule {}
