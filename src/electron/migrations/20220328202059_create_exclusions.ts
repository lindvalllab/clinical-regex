import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('exclusions'))) {
    await knex.schema.createTable('exclusions', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.text('pattern').notNullable();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable('exclusions')) {
    await knex.schema.dropTable('exclusions');
  }
}
