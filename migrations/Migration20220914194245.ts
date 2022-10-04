import { Migration } from '@mikro-orm/migrations';

export class Migration20220914194245 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "group" alter column "last_update_at" type timestamptz(0) using ("last_update_at"::timestamptz(0));');
    this.addSql('alter table "group" alter column "last_update_at" drop not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "group" alter column "last_update_at" type timestamptz(0) using ("last_update_at"::timestamptz(0));');
    this.addSql('alter table "group" alter column "last_update_at" set not null;');
  }

}
