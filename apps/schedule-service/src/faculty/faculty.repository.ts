import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoreV2Repository } from '@dstu_helper/common/repository/core-v2.repository';
import { FacultyEntity } from './faculty.entity';

export class FacultyRepository extends CoreV2Repository<FacultyEntity> {
  constructor(@InjectRepository(FacultyEntity) repository: Repository<FacultyEntity>) {
    super(repository);
  }
}
