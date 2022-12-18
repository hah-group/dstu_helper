import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FacultyEntity } from './faculty.entity';
import { CoreV2Repository } from '@dstu_helper/common';

export class FacultyRepository extends CoreV2Repository<FacultyEntity> {
  constructor(@InjectRepository(FacultyEntity) repository: Repository<FacultyEntity>) {
    super(repository);
  }
}
