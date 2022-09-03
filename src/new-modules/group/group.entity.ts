import { DomainEntity } from '../../framework/database/domain.entity';
import { Collection, Entity, OneToMany, OneToOne } from '@mikro-orm/core';
import { UserEntity } from '../user/user.entity';
import { UniversityEntity } from '../university/university.entity';
import { LessonEntity } from '../lesson/lesson.entity';

@Entity({ tableName: 'Group' })
export class GroupEntity extends DomainEntity {
  @OneToOne()
  public university!: UniversityEntity;

  @OneToMany(() => UserEntity, 'group')
  public users = new Collection<UserEntity>(this);

  @OneToMany(() => LessonEntity, 'group')
  public lessons = new Collection<LessonEntity>(this);
}
