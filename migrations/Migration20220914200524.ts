import { Migration } from '@mikro-orm/migrations';

export class Migration20220914200524 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "conversation" add column "default_group_id" int not null;');
    this.addSql('alter table "conversation" add constraint "conversation_default_group_id_foreign" foreign key ("default_group_id") references "group" ("key") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "conversation" drop constraint "conversation_default_group_id_foreign";');

    this.addSql('alter table "conversation" drop column "default_group_id";');
  }

}
