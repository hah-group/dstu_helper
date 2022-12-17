import { DynamicModule, Logger } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { LoadStrategy } from '@mikro-orm/core';
import * as path from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';

export class DatabaseV2Module {
  private static readonly log = new Logger('ORM');

  public static forRoot(applicationName: string): DynamicModule {
    return {
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DATABASE_HOST,
          port: parseInt(process.env.DATABASE_PORT || '5432'),
          username: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          database: process.env.DATABASE_NAME,
          synchronize: true,
          autoLoadEntities: true,

          applicationName: applicationName,
          //logging: process.env.ENV == 'dev' ? 'all' : ['warn', 'error'],
        }),
        /*MikroOrmModule.forRoot({
          entities: [path.join(process.cwd(), './dist/apps/schedule-service/!**!/!*.entity.js')],
          entitiesTs: [
            path.join(process.cwd(), './apps/schedule-service/!*!/src/!**!/!*.entity.ts'),
            path.join(process.cwd(), './libs/!*!/src/!**!/!*.entity.ts'),
          ],

          type: 'postgresql',
          host: process.env.DATABASE_HOST,
          port: parseInt(process.env.DATABASE_PORT || '5432'),
          user: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          dbName: process.env.DATABASE_NAME,
          metadataProvider: TsMorphMetadataProvider,

          forceUndefined: true,

          loadStrategy: LoadStrategy.JOINED,
          debug: process.env.ENV == 'dev',
        }),*/
      ],
      global: true,
      module: DatabaseV2Module,
    };
  }
}
