import { DynamicModule, Logger } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { LoadStrategy } from '@mikro-orm/core';

export class DatabaseModule {
  private static readonly log = new Logger('ORM');

  public static forRoot(): DynamicModule {
    return {
      imports: [
        MikroOrmModule.forRoot({
          entities: [`./dist/src/modules/**/*.entity.js`],

          type: 'postgresql',
          host: process.env.DATABASE_HOST,
          port: parseInt(process.env.DATABASE_PORT || '5432'),
          user: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          dbName: process.env.DATABASE_NAME,
          metadataProvider: TsMorphMetadataProvider,

          forceUndefined: true,

          loadStrategy: LoadStrategy.JOINED,
        }),
      ],
      global: true,
      module: DatabaseModule,
    };
  }
}
