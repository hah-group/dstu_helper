import { DomainEntity } from '../../framework/database/domain.entity';
import { Entity, OneToOne, Property } from '@mikro-orm/core';
import { GroupEntity } from '../group/group.entity';

@Entity({ tableName: 'university' })
export class UniversityEntity extends DomainEntity {
  @Property()
  public name: string;

  @OneToOne(() => GroupEntity, (group) => group.university)
  public group: GroupEntity;
}
