import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable('texts'))) {
    await knex.schema.createTable('texts', (table) => {
      table.increments('id').primary();
      table.string('group_id').notNullable();
      table.text('text').notNullable();
    });
  }

  if (!(await knex.schema.hasTable('labels'))) {
    await knex.schema.createTable('labels', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.text('pattern').notNullable();
    });
  }

  if (!(await knex.schema.hasTable('annotations'))) {
    await knex.schema.createTable('annotations', (table) => {
      table.increments('id').primary();
      table
        .string('group_id')
        .references('group_id')
        .inTable('texts')
        .notNullable();
      table.string('label').references('name').inTable('labels').notNullable();
      table.integer('value').notNullable();
      table.unique(['group_id', 'label']);
    });
  }

  if (!(await knex.schema.hasTable('settings'))) {
    await knex.schema.createTable('settings', (table) => {
      table.increments('id').primary();
      table.integer('IS_GROUPED').notNullable();
      table.string('GROUP_ID_FIELD');
      table.string('TEXT_ID_FIELD').notNullable();
    });
  }

  if (!(await knex.schema.hasTable('matches'))) {
    await knex.schema.createTable('matches', (table) => {
      table.increments('id').primary();
      table.integer('text_id').references('id').inTable('texts').notNullable();
      table.string('label').references('name').inTable('labels').notNullable();
      table.integer('start').notNullable();
      table.integer('length').notNullable();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  if (await knex.schema.hasTable('texts')) {
    await knex.schema.dropTable('texts');
  }
  if (await knex.schema.hasTable('labels')) {
    await knex.schema.dropTable('labels');
  }
  if (await knex.schema.hasTable('annotations')) {
    await knex.schema.dropTable('annotations');
  }
  if (await knex.schema.hasTable('settings')) {
    await knex.schema.dropTable('settings');
  }
  if (await knex.schema.hasTable('matches')) {
    await knex.schema.dropTable('matches');
  }
}
