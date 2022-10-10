import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

export default {
  entities: [`./dist/src/modules/**/*.entity.js`, './dist/src/framework/database/*.entity.js'],
  entitiesTs: [`./src/modules/**/*.entity.ts`, './src/framework/database/*.entity.ts'],

  type: 'postgresql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  dbName: process.env.DATABASE_NAME,
  metadataProvider: TsMorphMetadataProvider,
};
