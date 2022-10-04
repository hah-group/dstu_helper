import { Migration } from '@mikro-orm/migrations';

export class Migration20220914210433 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "lesson" drop constraint if exists "lesson_type_check";');

    this.addSql('alter table "lesson" drop constraint "lesson_teacher_id_foreign";');

    this.addSql('alter table "lesson" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "lesson" add constraint "lesson_type_check" check ("type" in (\'LECTURE\', \'PRACTICAL\', \'PHYSICAL_EDUCATION\', \'LABORATORY\', \'EXAMINATION\', \'EXAM_WITHOUT_MARK\'));');
    this.addSql('alter table "lesson" alter column "teacher_id" type int using ("teacher_id"::int);');
    this.addSql('alter table "lesson" alter column "teacher_id" set not null;');
    this.addSql('alter table "lesson" add constraint "lesson_teacher_id_foreign" foreign key ("teacher_id") references "teacher" ("key") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "lesson" drop constraint if exists "lesson_type_check";');

    this.addSql('alter table "lesson" drop constraint "lesson_teacher_id_foreign";');

    this.addSql('alter table "lesson" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "lesson" add constraint "lesson_type_check" check ("type" in (\'LECTURE\', \'PRACTICAL\', \'LABORATORY\', \'EXAMINATION\', \'EXAM_WITHOUT_MARK\'));');
    this.addSql('alter table "lesson" alter column "teacher_id" type int using ("teacher_id"::int);');
    this.addSql('alter table "lesson" alter column "teacher_id" drop not null;');
    this.addSql('alter table "lesson" add constraint "lesson_teacher_id_foreign" foreign key ("teacher_id") references "teacher" ("key") on update cascade on delete set null;');
  }

}
