import { DomainEntity } from '@dstu_helper/common';
import { Column, Entity, Index, JoinTable, OneToMany } from 'typeorm';

import { LessonEntity } from '../lesson/lesson.entity';
import { AudienceInfo } from '../lesson/parser/lesson.parser';

@Entity({ name: 'audience' })
@Index(['corpus', 'classRoom', 'distance'], { unique: true })
export class AudienceEntity extends DomainEntity {
  @Column({ nullable: true })
  public corpus?: string;

  @Column({ nullable: true })
  public classRoom?: string;

  @Column()
  public distance!: boolean;

  @OneToMany(() => LessonEntity, (entity) => entity.audience)
  @JoinTable()
  public lessons!: Promise<LessonEntity[]>;

  public get uniqueId(): string {
    return [this.corpus, this.classRoom, this.distance].join('_');
  }

  public static Create(data: AudienceInfo): AudienceEntity {
    const entity = new this();
    entity.update(data);
    return entity;
  }

  public update(data: AudienceInfo): void {
    this.corpus = data.corpus;
    this.classRoom = data.classRoom;
    this.distance = data.distance;
  }

  public render(): string | undefined {
    if (this.distance) return;
    if (this.corpus) return `${this.corpus}-${this.classRoom}`;
    else return this.classRoom;
  }
}
