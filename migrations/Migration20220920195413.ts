import { Migration } from '@mikro-orm/migrations';

export class Migration20220920195413 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "conversation" add column "external_id" int not null;');
    this.addSql('alter table "conversation" drop constraint "conversation_provider_default_group_id_unique";');
    this.addSql('alter table "conversation" add constraint "conversation_provider_external_id_unique" unique ("provider", "external_id");');

    this.addSql('alter table "user" add constraint "user_external_id_provider_unique" unique ("external_id", "provider");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "conversation" drop constraint "conversation_provider_external_id_unique";');
    this.addSql('alter table "conversation" drop column "external_id";');
    this.addSql('alter table "conversation" add constraint "conversation_provider_default_group_id_unique" unique ("provider", "default_group_id");');

    this.addSql('alter table "user" drop constraint "user_external_id_provider_unique";');
  }

}
