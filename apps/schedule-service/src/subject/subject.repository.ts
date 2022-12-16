import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoreV2Repository } from '@dstu_helper/common/repository/core-v2.repository';
import { SubjectEntity } from './subject.entity';

export class SubjectRepository extends CoreV2Repository<SubjectEntity> {
  constructor(@InjectRepository(SubjectEntity) repository: Repository<SubjectEntity>) {
    super(repository);
  }
}
