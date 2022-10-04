import { Migration } from '@mikro-orm/migrations';

export class Migration20221004133522 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "properties" json null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "properties";');
  }

}
