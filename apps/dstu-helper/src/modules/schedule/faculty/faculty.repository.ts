import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FacultyEntity } from './faculty.entity';
import { CoreRepository } from '@dstu_helper/common';

export class FacultyRepository extends CoreRepository<FacultyEntity> {
  constructor(@InjectRepository(FacultyEntity) repository: Repository<FacultyEntity>) {
    super(repository);
  }
}
