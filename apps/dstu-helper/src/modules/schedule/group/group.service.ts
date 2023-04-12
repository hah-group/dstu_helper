//TODO Maybe move
import { NormalizeGroup } from '@dstu_helper/common';
import { Injectable } from '@nestjs/common';

import { GroupEntity } from './group.entity';
import { GroupRepository } from './group.repository';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) {}

  public async findGroup(query: string): Promise<GroupEntity | undefined> {
    const groups = await this.groupRepository.findAll();
    return groups.find((record) => NormalizeGroup(query) == NormalizeGroup(record.name));
  }
}