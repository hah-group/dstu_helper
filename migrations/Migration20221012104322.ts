import { Migration } from '@mikro-orm/migrations';

export class Migration20221012104322 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "conversation" alter column "external_id" type bigint using ("external_id"::bigint);');

    this.addSql('alter table "user" alter column "external_id" type bigint using ("external_id"::bigint);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "conversation" alter column "external_id" type int using ("external_id"::int);');

    this.addSql('alter table "user" alter column "external_id" type int using ("external_id"::int);');
  }

}
