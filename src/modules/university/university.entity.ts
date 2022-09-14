import { DomainEntity } from '../../framework/database/domain.entity';
import { Entity, OneToOne, Property, Unique } from '@mikro-orm/core';
import { GroupEntity } from '../group/group.entity';
import { ScheduleProviderName } from '../schedule/schedule-provider-name.type';

@Entity({ tableName: 'university' })
export class UniversityEntity extends DomainEntity {
  @Property()
  @Unique()
  public name: ScheduleProviderName;

  @OneToOne(() => GroupEntity, (group) => group.university)
  public group: GroupEntity;
}
