import { Migration } from '@mikro-orm/migrations';

export class Migration20220914210541 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "lesson" alter column "subgroup" type int using ("subgroup"::int);');
    this.addSql('alter table "lesson" alter column "subgroup" set not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "lesson" alter column "subgroup" type int using ("subgroup"::int);');
    this.addSql('alter table "lesson" alter column "subgroup" drop not null;');
  }

}
