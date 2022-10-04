import { Migration } from '@mikro-orm/migrations';

export class Migration20220925122116 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "group" add column "status" text check ("status" in (\'READY\', \'IN_PROGRESS\', \'WITH_ERRORS\')) not null default \'READY\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "group" drop column "status";');
  }

}
