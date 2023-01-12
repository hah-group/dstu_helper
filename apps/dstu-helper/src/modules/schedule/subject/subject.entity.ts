import { Column, Entity, JoinTable, OneToMany } from 'typeorm';
import { DomainEntity } from '@dstu_helper/common';
import { LessonEntity } from '../lesson/lesson.entity';

@Entity({ name: 'subject' })
export class SubjectEntity extends DomainEntity {
  @Column({ unique: true })
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
