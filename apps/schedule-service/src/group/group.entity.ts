import { Column, Entity, Index, JoinTable, ManyToOne, OneToMany } from 'typeorm';
import { LessonEntity } from '../lesson/lesson.entity';
import { GroupStatus } from './group-status.enum';
import { DateTime, DomainV2Entity } from '@dstu_helper/common';
import { FacultyEntity } from '../faculty/faculty.entity';

@Entity({ name: 'group' })
export class GroupEntity extends DomainV2Entity {
  @Column()
  public name!: string;

  @Column()
  @Index({ unique: true })
  public externalId!: number;

  @Column({ type: 'varchar', length: 16 })
  public status: GroupStatus = GroupStatus.READY;

  /*@OneToMany(() => UserEntity, 'group')
  public users = new Collection<UserEntity>(this);*/

  @OneToMany(() => LessonEntity, (entity) => entity.group)
  @JoinTable()
  public lessons!: Promise<LessonEntity[]>;

  /*@OneToMany(() => ConversationEntity, 'defaultGroup')
  public conversations = new Collection<ConversationEntity>(this);*/

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

  /*public async getLessonsAtDate(atDate: DateTime): Promise<LessonEntity[]> {
    if (!this.isInitialized()) await this.init();
    //if (!this.lessons.isInitialized()) await this.lessons.init();

    return this.lessons.matching({ filters: { atDateFilter: { date: atDate } } });
  }*/

  public async getLessons(): Promise<LessonEntity[]> {
    /*if (!this.isInitialized()) await this.init();
    return this.lessons.getItems();*/
    return [];
  }

  public isEquals(group: GroupEntity): boolean {
    return this.id == group.id;
  }
}
