import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoreV2Repository } from '@dstu_helper/common/repository/core-v2.repository';
import { LessonEntity } from './lesson.entity';

export class LessonRepository extends CoreV2Repository<LessonEntity> {
  constructor(@InjectRepository(LessonEntity) repository: Repository<LessonEntity>) {
    super(repository);
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
