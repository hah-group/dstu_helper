import { Module } from '@nestjs/common';
import { UniversityService } from './university.service';
import { DstuModule } from '../dstu/dstu.module';

@Module({
  imports: [DstuModule],
  providers: [UniversityService],
  exports: [UniversityService],
})
export class UniversityModule {}
