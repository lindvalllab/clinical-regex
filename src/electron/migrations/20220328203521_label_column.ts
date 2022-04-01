import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable('labels')) {
    await knex.schema.renameTable('labels', 'patterns');
  }

  if (await knex.schema.hasColumn('patterns', 'name')) {
    await knex.schema.alterTable('patterns', (table) => {
      table.renameColumn('name', 'label');
    });
  }

  if (await knex.schema.hasColumn('exclusions', 'name')) {
    await knex.schema.alterTable('exclusions', (table) => {
      table.renameColumn('name', 'label');
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable('patterns')) {
    await knex.schema.renameTable('patterns', 'labels');
  }

  if (await knex.schema.hasColumn('labels', 'label')) {
    await knex.schema.alterTable('labels', (table) => {
      table.renameColumn('label', 'name');
    });
  }

  if (await knex.schema.hasColumn('exclusions', 'label')) {
    await knex.schema.alterTable('exclusions', (table) => {
      table.renameColumn('label', 'name');
    });
  }
}
