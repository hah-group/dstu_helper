import { Migration } from '@mikro-orm/migrations';

export class Migration20220913184524 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "conversation" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');

    this.addSql('create table "teacher" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "first_name" varchar(255) null, "last_name" varchar(255) null, "middle_name" varchar(255) null, "degree_raw" varchar(255) null);');

    this.addSql('create table "university" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null);');

    this.addSql('create table "group" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "university_id" int not null);');
    this.addSql('alter table "group" add constraint "group_university_id_unique" unique ("university_id");');

    this.addSql('create table "lesson" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "group_id" int not null, "start" timestamptz(0) not null, "end" timestamptz(0) not null, "type" text check ("type" in (\'LECTURE\', \'PRACTICAL\', \'LABORATORY\', \'EXAMINATION\', \'EXAM_WITHOUT_MARK\')) not null, "order" int not null, "name" varchar(255) not null, "teacher_id" int null, "subgroup" int null, "subsection" varchar(255) null, "corpus" varchar(255) null, "class_room" varchar(255) null, "distance" boolean not null, constraint "lesson_pkey" primary key ("id"));');

    this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "first_name" varchar(255) null, "last_name" varchar(255) null, "provider" varchar(255) not null, "locale" varchar(255) not null, "group_id" int not null);');

    this.addSql('create table "user_conversations" ("user_entity_id" int not null, "conversation_entity_id" int not null, constraint "user_conversations_pkey" primary key ("user_entity_id", "conversation_entity_id"));');

    this.addSql('alter table "group" add constraint "group_university_id_foreign" foreign key ("university_id") references "university" ("id") on update cascade;');

    this.addSql('alter table "lesson" add constraint "lesson_group_id_foreign" foreign key ("group_id") references "group" ("id") on update cascade;');
    this.addSql('alter table "lesson" add constraint "lesson_teacher_id_foreign" foreign key ("teacher_id") references "teacher" ("id") on update cascade on delete set null;');

    this.addSql('alter table "user" add constraint "user_group_id_foreign" foreign key ("group_id") references "group" ("id") on update cascade;');

    this.addSql('alter table "user_conversations" add constraint "user_conversations_user_entity_id_foreign" foreign key ("user_entity_id") references "user" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "user_conversations" add constraint "user_conversations_conversation_entity_id_foreign" foreign key ("conversation_entity_id") references "conversation" ("id") on update cascade on delete cascade;');
  }

}
