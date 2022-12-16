import { Migration } from '@mikro-orm/migrations';

export class Migration20221204214243 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "group" add column "faculty" varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "group" drop column "faculty";');
  }

}
