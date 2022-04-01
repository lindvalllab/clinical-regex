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

export async function down(_knex: Knex): Promise<void> {
  // Don't drop the exclusions table, as this would lose information
  // for people opening the file in an older version.
}
