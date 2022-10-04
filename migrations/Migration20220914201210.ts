import { Migration } from '@mikro-orm/migrations';

export class Migration20220914201210 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "conversation" add column "provider" varchar(255) not null;');
    this.addSql('alter table "conversation" add constraint "conversation_provider_default_group_id_unique" unique ("provider", "default_group_id");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "conversation" drop constraint "conversation_provider_default_group_id_unique";');
    this.addSql('alter table "conversation" drop column "provider";');
  }

}
