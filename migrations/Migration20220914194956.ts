import { Migration } from '@mikro-orm/migrations';

export class Migration20220914194956 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "group" drop constraint "group_university_id_unique";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "group" add constraint "group_university_id_unique" unique ("university_id");');
  }

}
