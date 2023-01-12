import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class DomainEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @CreateDateColumn()
  public readonly createdAt!: Date;

  @UpdateDateColumn()
  public readonly updatedAt!: Date;

  public get isSaved(): boolean {
    return typeof this.id !== 'number';
  }
}
