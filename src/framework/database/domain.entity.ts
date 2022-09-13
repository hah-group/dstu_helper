import { PrimaryKey } from '@mikro-orm/core';
import { TimestampedEntity } from './timestamped.entity';

export class DomainEntity extends TimestampedEntity {
  constructor() {
    super();
  }

  @PrimaryKey()
  public readonly id!: number;
}
