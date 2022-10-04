import { BaseEntity, PrimaryKey, Property } from '@mikro-orm/core';

export class DomainEntity extends BaseEntity<DomainEntity, 'id'> {
  @PrimaryKey()
  public id!: number;

  @Property()
  public readonly createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  public readonly updatedAt: Date = new Date();
}
