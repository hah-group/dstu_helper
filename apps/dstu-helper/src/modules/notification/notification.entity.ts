import { DomainEntity } from '@dstu_helper/common';
import { Column, Entity, Index, JoinTable, ManyToOne } from 'typeorm';

import { PropertiesTransformer } from '../../../../../libs/common/src/properties';
import { UserEntity } from '../user/user.entity';
import { NotificationProperties, NotificationPropertiesData } from './properties/notification-properties';

@Entity({ name: 'notification' })
@Index(['event', 'user'], { unique: true })
export class NotificationEntity extends DomainEntity {
  @Column()
  public event!: string;

  @ManyToOne(() => UserEntity, (entity) => entity.notifications, { eager: true, cascade: ['update'], nullable: false })
  @JoinTable()
  public user!: UserEntity;

  @Column({
    type: 'simple-json',
    nullable: false,
    transformer: new PropertiesTransformer(NotificationProperties),
  })
  public properties!: NotificationProperties;

  public static Create(user: UserEntity, event: string, data?: NotificationPropertiesData): NotificationEntity {
    const entity = new this();
    entity.event = event;
    entity.user = user;
    entity.properties = new NotificationProperties(data);
    return entity;
  }
}
