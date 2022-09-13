import { Migration } from '@mikro-orm/migrations';

export class Migration20220913212603 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_group_id_foreign";');

    this.addSql('alter table "user" add column "nickname" varchar(255) null, add column "provider" varchar(255) not null, add column "external_id" int not null;');
    this.addSql('alter table "user" alter column "group_id" type int using ("group_id"::int);');
    this.addSql('alter table "user" alter column "group_id" drop not null;');
    this.addSql('alter table "user" drop column "social";');
    this.addSql('alter table "user" drop column "locale";');
    this.addSql('alter table "user" add constraint "user_group_id_foreign" foreign key ("group_id") references "group" ("id") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop constraint "user_group_id_foreign";');

    this.addSql('alter table "user" add column "locale" varchar(255) not null;');
    this.addSql('alter table "user" alter column "group_id" type int using ("group_id"::int);');
    this.addSql('alter table "user" alter column "group_id" set not null;');
    this.addSql('alter table "user" drop column "nickname";');
    this.addSql('alter table "user" drop column "external_id";');
    this.addSql('alter table "user" rename column "provider" to "social";');
    this.addSql('alter table "user" add constraint "user_group_id_foreign" foreign key ("group_id") references "group" ("id") on update cascade;');
  }

}
