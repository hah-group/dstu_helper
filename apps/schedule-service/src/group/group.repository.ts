import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoreV2Repository } from '@dstu_helper/common/repository/core-v2.repository';
import { GroupEntity } from './group.entity';

export class GroupRepository extends CoreV2Repository<GroupEntity> {
  constructor(@InjectRepository(GroupEntity) repository: Repository<GroupEntity>) {
    super(repository);
  }

  /*@UseRequestContext()
  public async upsert(entity: GroupEntity[]): Promise<void> {
    await this.orm.em.upsertMany(GroupEntity, entity);
  }

  @UseRequestContext()
  public async getById(university: string, id: number): Promise<GroupEntity | null> {
    return this.queryBuilder()
      .where({
        university: {
          name: university,
        },
        externalId: id,
      })
      .getSingleResult();
  }

  @UseRequestContext()
  public async getAllForUniversity(university: string): Promise<GroupEntity[]> {
    return this.queryBuilder()
      .where({
        university: {
          name: university,
        },
      })
      .getResult();
  }

  @UseRequestContext()
  public async deleteMany(entities: GroupEntity[]): Promise<void> {
    await this.queryBuilder()
      .delete({
        id: entities.map((entity) => entity.id),
      })
      .execute();
  }*/
}
