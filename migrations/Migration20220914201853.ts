import { Migration } from '@mikro-orm/migrations';

export class Migration20220914201853 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "conversation" drop constraint "conversation_default_group_id_foreign";');

    this.addSql('alter table "conversation" alter column "default_group_id" type int using ("default_group_id"::int);');
    this.addSql('alter table "conversation" alter column "default_group_id" drop not null;');
    this.addSql('alter table "conversation" add constraint "conversation_default_group_id_foreign" foreign key ("default_group_id") references "group" ("key") on update cascade on delete set null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "conversation" drop constraint "conversation_default_group_id_foreign";');

    this.addSql('alter table "conversation" alter column "default_group_id" type int using ("default_group_id"::int);');
    this.addSql('alter table "conversation" alter column "default_group_id" set not null;');
    this.addSql('alter table "conversation" add constraint "conversation_default_group_id_foreign" foreign key ("default_group_id") references "group" ("key") on update cascade;');
  }

}
