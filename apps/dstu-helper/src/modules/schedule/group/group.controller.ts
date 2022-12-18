import { Controller } from '@nestjs/common';
import { GroupEntity } from './group.entity';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GroupRepository } from './group.repository';
import { GroupCommand, GroupGetRequest } from '@dstu_helper/microservices';

@Controller()
export class GroupController {
  constructor(private readonly groupRepository: GroupRepository) {}

  @MessagePattern(GroupCommand.GET)
  public async get(@Payload() payload: GroupGetRequest): Promise<GroupEntity | null> {
    return this.groupRepository.get(payload.groupId);
  }
}
