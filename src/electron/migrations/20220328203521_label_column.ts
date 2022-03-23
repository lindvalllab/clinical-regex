import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.renameTable('labels', 'patterns');
  await knex.schema.alterTable('patterns', (table) => {
    table.renameColumn('name', 'label');
  });
  await knex.schema.alterTable('exclusions', (table) => {
    table.renameColumn('name', 'label');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.renameTable('patterns', 'labels');
  await knex.schema.alterTable('labels', (table) => {
    table.renameColumn('label', 'name');
  });
  await knex.schema.alterTable('exclusions', (table) => {
    table.renameColumn('label', 'name');
  });
}
