import { Migration } from '@mikro-orm/migrations';

export class Migration20220914100831 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "lesson" add column "external_id" varchar(255) not null;');
    this.addSql('alter table "lesson" alter column "key" type int using ("key"::int);');
    this.addSql('create sequence if not exists "lesson_id_seq";');
    this.addSql('select setval(\'lesson_id_seq\', (select max("key") from "lesson"));');
    this.addSql('alter table "lesson" alter column "key" set default nextval(\'lesson_id_seq\');');
    this.addSql('alter table "lesson" add constraint "lesson_external_id_unique" unique ("external_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "lesson" alter column "key" type varchar(255) using ("key"::varchar(255));');
    this.addSql('alter table "lesson" drop constraint "lesson_external_id_unique";');
    this.addSql('alter table "lesson" drop column "external_id";');
    this.addSql('alter table "lesson" alter column "key" drop default;');
  }

}
