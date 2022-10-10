import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { GroupEntity } from './group.entity';
import { GroupRepository } from './group.repository';

@Module({
  imports: [MikroOrmModule.forFeature([GroupEntity])],
  providers: [GroupRepository],
  exports: [GroupRepository],
})
export class GroupModule {}
