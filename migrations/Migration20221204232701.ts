import { Migration } from '@mikro-orm/migrations';

export class Migration20221204232701 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "lesson" drop constraint if exists "lesson_type_check";');

    this.addSql('alter table "lesson" alter column "type" type varchar(255) using ("type"::varchar(255));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "lesson" alter column "type" type text using ("type"::text);');
    this.addSql('alter table "lesson" add constraint "lesson_type_check" check ("type" in (\'LECTURE\', \'PRACTICAL\', \'PHYSICAL_EDUCATION\', \'LABORATORY\', \'EXAMINATION\', \'EXAM_WITHOUT_MARK\'));');
  }

}
