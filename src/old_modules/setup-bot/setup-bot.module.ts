import { Module } from '@nestjs/common';
import { SetupBotHandler } from './setup-bot.handler';
import { UserModule } from '../user/user.module';
import { DstuModule } from '../dstu/dstu.module';
import { StudyGroupModule } from '../study-group/study-group.module';
import { CacheModule } from '../cache/cache.module';

@Module({
  providers: [SetupBotHandler],
  imports: [UserModule, DstuModule, StudyGroupModule, CacheModule],
})
export class SetupBotModule {}
