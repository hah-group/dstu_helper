import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { VkIoModule } from '../vk-io/vk-io.module';

@Module({
  providers: [UserService],
  imports: [VkIoModule],
  exports: [UserService],
})
export class UserModule {}
