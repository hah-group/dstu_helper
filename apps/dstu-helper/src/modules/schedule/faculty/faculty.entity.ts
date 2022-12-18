import { Column, Entity, JoinTable, OneToMany } from 'typeorm';
import { DomainV2Entity } from '@dstu_helper/common';
import { GroupEntity } from '../group/group.entity';

@Entity({ name: 'faculty' })
export class FacultyEntity extends DomainV2Entity {
  @Column()
  public name!: string;

  @Column({ unique: true })
  public externalId!: number;

  @OneToMany(() => GroupEntity, (entity) => entity.faculty)
  @JoinTable()
  public groups!: Promise<GroupEntity[]>;

  public static Create(externalId: number, name: string): FacultyEntity {
    const entity = new this();
    entity.externalId = externalId;
    entity.name = name;
    return entity;
  }
}
