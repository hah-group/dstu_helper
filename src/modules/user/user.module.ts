import { Module } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity])],
  providers: [UserRepository],
  exports: [UserRepository],
  controllers: [UserController],
})
export class UserModule {}
