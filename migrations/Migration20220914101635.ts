import { Migration } from '@mikro-orm/migrations';

export class Migration20220914101635 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "lesson" drop constraint "lesson_external_id_unique";');
    this.addSql('alter table "lesson" drop column "external_id";');
    this.addSql('alter table "lesson" add constraint "lesson_group_id_start_subgroup_teacher_id_unique" unique ("group_id", "start", "subgroup", "teacher_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "lesson" add column "external_id" varchar(255) not null;');
    this.addSql('alter table "lesson" drop constraint "lesson_group_id_start_subgroup_teacher_id_unique";');
    this.addSql('alter table "lesson" add constraint "lesson_external_id_unique" unique ("external_id");');
  }

}
