import { Module } from '@nestjs/common';
import { DstuService } from './dstu.service';

@Module({
  providers: [DstuService],
  exports: [DstuService],
})
export class DstuModule {}
