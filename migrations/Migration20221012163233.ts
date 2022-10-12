import { Migration } from '@mikro-orm/migrations';

export class Migration20221012163233 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "lesson" drop constraint "lesson_teacher_id_foreign";');

    this.addSql('alter table "lesson" alter column "teacher_id" type int using ("teacher_id"::int);');
    this.addSql('alter table "lesson" alter column "teacher_id" drop not null;');
    this.addSql('alter table "lesson" add constraint "lesson_teacher_id_foreign" foreign key ("teacher_id") references "teacher" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "lesson" drop constraint "lesson_teacher_id_foreign";');

    this.addSql('alter table "lesson" alter column "teacher_id" type int using ("teacher_id"::int);');
    this.addSql('alter table "lesson" alter column "teacher_id" set not null;');
    this.addSql('alter table "lesson" add constraint "lesson_teacher_id_foreign" foreign key ("teacher_id") references "teacher" ("id") on update cascade;');
  }

}
