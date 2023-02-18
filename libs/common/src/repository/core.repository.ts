import { DomainEntity } from '@dstu_helper/common';
import { Logger } from '@nestjs/common';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

export abstract class CoreRepository<E extends DomainEntity> {
  private readonly log = new Logger('Repository');

  protected constructor(protected readonly repository: Repository<E>) {}

  public async get(id: number): Promise<E | null> {
    return this.repository.findOne(<any>{
      where: {
        id: id,
      },
    });
  }

  public async findOne(query: FindOptionsWhere<E>, options?: Omit<FindOneOptions<E>, 'where'>): Promise<E | null> {
    return this.repository.findOne({
      where: query,
      ...options,
    });
  }

  public async findAll(data?: FindOptionsWhere<E>): Promise<E[]> {
    return this.repository.find({ where: data });
  }

  public async delete(entity: E | E[]): Promise<void> {
    this.log.debug(
      `Deleting entity${Array.isArray(entity) ? ` array (${entity.length})` : ''}: ${this.repository.metadata.name}`,
    );
    const entities = Array.isArray(entity) ? entity : [entity];
    await this.repository.remove(entities);
  }

  public async save(entity: E | E[]): Promise<void> {
    this.log.debug(
      `Saving entity${Array.isArray(entity) ? ` array (${entity.length})` : ''}: ${this.repository.metadata.name}`,
    );
    const entities = Array.isArray(entity) ? entity : [entity];
    await this.repository.save(entities);
  }
}
