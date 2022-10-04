import { Migration } from '@mikro-orm/migrations';

export class Migration20220920223415 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "group" add column "external_id" int not null;');
    this.addSql('alter table "group" add constraint "group_external_id_university_id_unique" unique ("external_id", "university_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "group" drop constraint "group_external_id_university_id_unique";');
    this.addSql('alter table "group" drop column "external_id";');
  }

}
