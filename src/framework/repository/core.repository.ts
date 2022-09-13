import { DomainEntity } from '../database/domain.entity';
import { EntityRepository, QueryBuilder } from '@mikro-orm/postgresql';
import { FilterQuery, Loaded, RequiredEntityData } from '@mikro-orm/core/typings';
import { FindOptions, MikroORM, UseRequestContext } from '@mikro-orm/core';
import { FindOneOptions } from '@mikro-orm/core/drivers/IDatabaseDriver';

export abstract class CoreRepository<E extends Record<string, any>> {
  protected constructor(protected readonly repository: EntityRepository<E>, protected readonly orm: MikroORM) {}

  @UseRequestContext()
  public async create(data: Omit<RequiredEntityData<E>, keyof DomainEntity>): Promise<E> {
    return this.repository.create(<RequiredEntityData<E>>data);
  }

  @UseRequestContext()
  public async get<P extends string = never>(id: number, options?: FindOneOptions<E, P>): Promise<Loaded<E, P> | null> {
    return this.repository.findOne(
      <any>{
        id: id,
      },
      options,
    );
  }

  @UseRequestContext()
  public async findOne<P extends string = never>(
    query: FilterQuery<E>,
    options?: FindOneOptions<E, P>,
  ): Promise<Loaded<E, P> | null> {
    return this.repository.findOne(query, options);
  }

  @UseRequestContext()
  public async findAll(data: FindOptions<E>): Promise<E[]> {
    return this.repository.findAll(data);
  }

  @UseRequestContext()
  public queryBuilder(alias?: string): QueryBuilder<E> {
    return this.repository.qb(alias);
  }

  @UseRequestContext()
  public async delete(entity: E): Promise<void> {
    return this.repository.remove(entity).flush();
  }

  @UseRequestContext()
  public async save(entity: E | E[]): Promise<void> {
    return this.repository.persistAndFlush(entity);
  }
}
