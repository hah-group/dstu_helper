import { Collection, Entity, OneToMany, Property, Unique } from '@mikro-orm/core';
import { DomainEntity } from '@dstu_helper/common';
import { GroupEntity } from '../group/group.entity';

@Entity({ tableName: 'faculty' })
export class FacultyEntity extends DomainEntity {
  @Property()
  public name!: string;

  @Property()
  @Unique()
  public externalId!: number;

  @OneToMany(() => GroupEntity, 'faculty')
  public groups = new Collection<GroupEntity>(this);

  constructor(externalId: number, name: string) {
    super();

    this.externalId = externalId;
    this.name = name;
  }
}
