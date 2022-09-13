import { Controller, Get } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Controller('user')
export class UserController {
  constructor(private readonly userRepository: UserRepository) {}
  @Get()
  public async get(): Promise<any> {
    return this.userRepository.findOne({
      provider: 'vk',
      externalId: 1,
    });
  }
}
