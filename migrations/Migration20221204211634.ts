import { Migration } from '@mikro-orm/migrations';

export class Migration20221204211634 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "university" add column "last_schedule_update_at" timestamptz(0) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "university" drop column "last_schedule_update_at";');
  }

}
