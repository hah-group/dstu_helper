import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { LessonEntity } from './lesson.entity';
import { CoreRepository, DateTime } from '@dstu_helper/common';
import { GroupEntity } from '../group/group.entity';

export class LessonRepository extends CoreRepository<LessonEntity> {
  constructor(@InjectRepository(LessonEntity) repository: Repository<LessonEntity>) {
    super(repository);
  }

  public async upsert(entities: LessonEntity[]): Promise<void> {
    await this.repository.upsert(entities, {
      skipUpdateIfNoValuesChanged: true,
      conflictPaths: ['group', 'start', 'subgroup', 'teacher'],
    });
  }

  public async getAll(group: GroupEntity): Promise<LessonEntity[]> {
    return this.repository.find({
      where: {
        group: {
          id: group.id,
        },
      },
    });
  }

  public async getAtDate(date: DateTime, group: GroupEntity): Promise<LessonEntity[]> {
    return this.repository.find({
      where: {
        start: MoreThanOrEqual(date.startOf('d').toDate()),
        end: LessThanOrEqual(date.endOf('d').toDate()),
        group: {
          id: group.id,
        },
      },
    });
  }

  /*@UseRequestContext()
  public async upsertMany(entities: LessonEntity[]): Promise<void> {
    await this.queryBuilder()
      .insert(entities)
      .onConflict(['group_id', 'start', 'subgroup', 'teacher_id'])
      .merge()
      .execute();
  }

  @UseRequestContext()
  public async deleteMany(entities: LessonEntity[]): Promise<void> {
    await this.queryBuilder()
      .delete({
        id: entities.map((entity) => entity.id),
      })
      .execute();
  }*/
}
