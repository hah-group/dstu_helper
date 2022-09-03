import { PrimaryKey } from '@mikro-orm/core';
import { TimestampedEntity } from './timestamped.entity';

export class DomainEntity extends TimestampedEntity {
  @PrimaryKey()
  public readonly id!: number;
}
