import { Module } from '@nestjs/common';
import { PrivateSetupHandler } from './private-setup.handler';
import { ScheduleTextQueryModule } from '../schedule-text-query/schedule-text-query.module';
import { UserModule } from '../../user/user.module';
import { ScheduleModule } from '../../schedule/schedule.module';

@Module({
  imports: [ScheduleTextQueryModule, UserModule, ScheduleModule],
  providers: [PrivateSetupHandler],
})
export class PrivateSetupModule {}
