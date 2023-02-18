import { DomainEntity } from '@dstu_helper/common';
import { Column, Entity, Index, JoinTable, ManyToOne, OneToMany } from 'typeorm';

import { ConversationEntity } from '../../conversation/conversation.entity';
import { UserEntity } from '../../user/user.entity';
import { FacultyEntity } from '../faculty/faculty.entity';
import { LessonEntity } from '../lesson/lesson.entity';
import { GroupStatus } from './group-status.enum';

@Entity({ name: 'group' })
export class GroupEntity extends DomainEntity {
  @Column()
  public name!: string;

  @Column()
  @Index({ unique: true })
  public externalId!: number;

  @Column({ type: 'varchar', length: 16 })
  public status: GroupStatus = GroupStatus.READY;

  @OneToMany(() => UserEntity, (entity) => entity.group)
  @JoinTable()
  public users!: Promise<UserEntity[]>;

  @OneToMany(() => LessonEntity, (entity) => entity.group, { nullable: false, cascade: true })
  @JoinTable()
  public lessons!: Promise<LessonEntity[]>;

  @OneToMany(() => ConversationEntity, (entity) => entity.defaultGroup)
  public conversations!: Promise<ConversationEntity>;

  @ManyToOne(() => FacultyEntity, (entity) => entity.groups, {
    eager: true,
    nullable: false,
    cascade: ['update'],
  })
  @JoinTable()
  public faculty!: FacultyEntity;

  public static Create(externalId: number, name: string, faculty: FacultyEntity): GroupEntity {
    const entity = new this();
    entity.externalId = externalId;
    entity.name = name;
    entity.faculty = faculty;
    return entity;
  }

  public isEquals(group: GroupEntity): boolean {
    return this.id == group.id;
  }
}
