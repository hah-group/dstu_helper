import { Module } from '@nestjs/common';
import { PrivateSetupHandler } from './private-setup.handler';
import { ScheduleTextQueryModule } from '../schedule-text-query/schedule-text-query.module';
import { UserModule } from '../../user/user.module';
import { GroupModule } from '../../schedule/group/group.module';

@Module({
  imports: [ScheduleTextQueryModule, UserModule, GroupModule],
  providers: [PrivateSetupHandler],
  exports: [PrivateSetupHandler],
})
export class PrivateSetupModule {}
