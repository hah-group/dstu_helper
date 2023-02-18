import { CoreRepository } from '@dstu_helper/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FacultyEntity } from './faculty.entity';

export class FacultyRepository extends CoreRepository<FacultyEntity> {
  constructor(@InjectRepository(FacultyEntity) repository: Repository<FacultyEntity>) {
    super(repository);
  }
}
