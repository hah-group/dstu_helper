import { Property } from '@mikro-orm/core';

export class TimestampedEntity {
  @Property()
  public readonly createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  public readonly updatedAt: Date = new Date();
}
