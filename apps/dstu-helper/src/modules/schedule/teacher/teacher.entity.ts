import { DomainEntity, lodash } from '@dstu_helper/common';
import { Column, Entity, JoinTable, OneToMany } from 'typeorm';

import { LessonEntity } from '../lesson/lesson.entity';
import { TeacherInfo } from '../lesson/parser/lesson.parser';
import { TeacherDegree } from './teacher-degree.enum';

@Entity({ name: 'teacher' })
export class TeacherEntity extends DomainEntity {
  @Column({ nullable: true })
  public firstName?: string;

  @Column()
  public lastName!: string;

  @Column({ nullable: true })
  public middleName?: string;

  @Column({ nullable: false })
  public degree!: TeacherDegree;

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
    this.degree = data.degree;
    this.externalId = externalId;
  }

  public render(short: boolean): string {
    const entities: (string | undefined)[] = [this.lastName];

    if (short) {
      if (this.firstName && this.middleName) {
        entities.push(`${this.firstName[0]}.${this.middleName[0]}.`);
      }
    } else entities.push(...[this.firstName, this.middleName]);

    let degree;
    switch (this.degree) {
      case TeacherDegree.DEAN:
        degree = 'Декан';
        break;
      case TeacherDegree.DEPARTMENT_CHAIRMAN:
        degree = 'Зам. кафедры';
        break;
    }

    //TODO Refactor this
    return `👨‍🏫 ${lodash.compact(entities).join(' ')}${degree ? ` (${degree})` : ''}`;
  }
}
