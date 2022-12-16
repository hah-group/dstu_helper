import { Column, Entity, JoinTable, OneToMany } from 'typeorm';
import { LessonEntity } from '../lesson/lesson.entity';
import { DomainV2Entity } from '@dstu_helper/common';
import { TeacherInfo } from '../lesson/parser/lesson.parser';

@Entity({ name: 'teacher' })
export class TeacherEntity extends DomainV2Entity {
  @Column({ nullable: true })
  public firstName?: string;

  @Column()
  public lastName!: string;

  @Column({ nullable: true })
  public middleName?: string;

  @Column({ nullable: true })
  public degreeRaw?: string;

  @Column({ unique: true })
  public externalId!: number;

  @OneToMany(() => LessonEntity, (entity) => entity.teacher)
  @JoinTable()
  public lessons!: Promise<LessonEntity[]>;

  public static Create(data: TeacherInfo, externalId: number): TeacherEntity {
    const entity = new this();
    entity.update(data, externalId);
    return entity;
  }

  public isEquals(entity: TeacherEntity): boolean {
    return entity.id == this.id;
  }

  public update(data: TeacherInfo, externalId: number): void {
    this.lastName = data.lastName;
    this.firstName = data.firstName;
    this.middleName = data.middleName;
    this.degreeRaw = data.degreeRaw;
    this.externalId = externalId;
  }
}
