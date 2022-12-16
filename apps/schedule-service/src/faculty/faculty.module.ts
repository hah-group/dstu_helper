import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { FacultyEntity } from './faculty.entity';
import { FacultyRepository } from './faculty.repository';

@Module({
  imports: [MikroOrmModule.forFeature([FacultyEntity])],
  providers: [FacultyRepository],
  exports: [FacultyRepository],
})
export class FacultyModule {}
