import { DynamicModule, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

export class DatabaseModule {
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
      ],
      global: true,
      module: DatabaseModule,
    };
  }
}
