import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { LessonEntity } from './lesson.entity';
import { CoreV2Repository, DateTime } from '@dstu_helper/common';
import { GroupEntity } from '../group/group.entity';

export class LessonRepository extends CoreV2Repository<LessonEntity> {
  constructor(@InjectRepository(LessonEntity) repository: Repository<LessonEntity>) {
    super(repository);
  }

  public async upsert(entities: LessonEntity[]): Promise<void> {
    await this.repository.upsert(entities, {
      skipUpdateIfNoValuesChanged: true,
      conflictPaths: ['group', 'start', 'subgroup', 'teacher'],
    });
  }

  public async getFromDate(date: DateTime, group: GroupEntity): Promise<LessonEntity[]> {
    return this.repository.find({
      where: {
        start: MoreThanOrEqual(date.startOf('d').toDate()),
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
