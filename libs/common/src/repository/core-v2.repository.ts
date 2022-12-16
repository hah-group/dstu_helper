import { Repository, FindOptionsWhere, FindOneOptions } from 'typeorm';
import { DomainV2Entity } from '@dstu_helper/common';

export abstract class CoreV2Repository<E extends DomainV2Entity> {
  protected constructor(protected readonly repository: Repository<E>) {}

  /*public async create(data: Omit<RequiredEntityData<E>, keyof DomainEntity>): Promise<E> {
    this.repository.create();
    return this.repository.create(<RequiredEntityData<E>>data);
  }*/

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

  /*public queryBuilder(alias?: string): QueryBuilder<E> {
    return this.repository.qb(alias);
  }*/

  public async delete(entity: E | E[]): Promise<void> {
    const entities = Array.isArray(entity) ? entity : [entity];
    await this.repository.remove(entities);
  }

  public async save(entity: E | E[]): Promise<void> {
    const entities = Array.isArray(entity) ? entity : [entity];
    await this.repository.save(entities);
  }
}
