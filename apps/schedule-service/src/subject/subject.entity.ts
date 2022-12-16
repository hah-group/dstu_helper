import { Column, Entity, JoinTable, OneToMany } from 'typeorm';
import { DomainV2Entity } from '@dstu_helper/common';
import { LessonEntity } from '../lesson/lesson.entity';

@Entity({ name: 'subject' })
export class SubjectEntity extends DomainV2Entity {
  @Column()
  public name!: string;

  @OneToMany(() => LessonEntity, (entity) => entity.subject)
  @JoinTable()
  public lessons!: Promise<LessonEntity[]>;

  public static Create(name: string): SubjectEntity {
    const entity = new this();
    entity.name = name;
    return entity;
  }
}
