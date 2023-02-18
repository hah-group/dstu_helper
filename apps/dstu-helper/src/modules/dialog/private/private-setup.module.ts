import { Module } from '@nestjs/common';

import { GroupModule } from '../../schedule/group/group.module';
import { UserModule } from '../../user/user.module';
import { ScheduleTextQueryModule } from '../schedule-text-query/schedule-text-query.module';
import { PrivateSetupHandler } from './private-setup.handler';

@Module({
  imports: [ScheduleTextQueryModule, UserModule, GroupModule],
  providers: [PrivateSetupHandler],
  exports: [PrivateSetupHandler],
})
export class PrivateSetupModule {}
