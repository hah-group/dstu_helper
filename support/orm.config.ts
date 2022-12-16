import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import * as path from 'path';

export default {
  entities: [path.join(process.cwd(), './dist/apps/schedule-service/**/*.entity.js')],
  //entitiesTs: [path.join(process.cwd(), './apps/schedule-service/*/**/*.entity.ts')],

  type: 'postgresql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  dbName: process.env.DATABASE_NAME,
  metadataProvider: TsMorphMetadataProvider,

  debug: true,
};
