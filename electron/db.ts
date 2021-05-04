import { knex } from 'knex';
import { Model, PartialModelObject } from 'objection';

const db = knex({
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: () => ({
    filename: './db.dev.sqlite',
  }),
});

// Give the knex instance to objection
Model.knex(db);

export class Text extends Model {
  static get tableName() {
    return 'texts';
  }
}

export class Label extends Model {
  static get tableName() {
    return 'labels';
  }
}

export class Annotation extends Model {
  static get tableName() {
    return 'annotations';
  }
}

async function createSchema() {
  if (!(await db.schema.hasTable('texts'))) {
    await db.schema.createTable('texts', (table) => {
      table.increments('id').primary();
      table.string('group_id');
      table.text('text');
    });
  }

  if (!(await db.schema.hasTable('labels'))) {
    await db.schema.createTable('labels', (table) => {
      table.increments('id').primary();
      table.string('name').unique();
      table.text('pattern');
    });
  }

  if (!(await db.schema.hasTable('annotations'))) {
    await db.schema.createTable('annotations', (table) => {
      table.increments('id').primary();
      table.string('group_id').references('group_id').inTable('texts');
      table.integer('label_id').references('id').inTable('labels');
      table.integer('value');
    });
  }
}

async function createDummyData() {
  const text = await Text.query().insert({
    group_id: 0,
    text: 'this is an example text',
  } as PartialModelObject<Text>);

  console.log('created:', text);

  const texts = await Text.query().orderBy('id');
  console.log(texts);
}

createSchema()
  .then(() => createDummyData())
  .catch((err) => {
    console.error(err);
  });

export { db };
