import { Module } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UserRepository],
  exports: [UserRepository],
  controllers: [UserController],
})
export class UserModule {}
