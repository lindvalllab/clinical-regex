import { app } from 'electron';
import { knex } from 'knex';
import { Model, PartialModelObject } from 'objection';
import path from 'path';
import type { CRText } from 'types';

const db = knex({
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: () => ({
    filename: path.join(app.getPath('userData'), 'db.sqlite'),
  }),
});

// Give the knex instance to objection
Model.knex(db);

export class TextModel extends Model {
  static get tableName(): string {
    return 'texts';
  }
}

export class LabelModel extends Model {
  static get tableName(): string {
    return 'labels';
  }
}

export class AnnotationModel extends Model {
  static get tableName(): string {
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
  const text = await TextModel.query().insert({
    group_id: 0,
    text: 'this is an example text',
  } as PartialModelObject<TextModel>);

  console.log('created:', text);

  const texts = await TextModel.query().orderBy('id');
  console.log(texts);
}

async function insertTexts(texts: CRText[]): Promise<void> {
  for (const text of texts) {
    try {
      await TextModel.query().insert(text as PartialModelObject<TextModel>);
    } catch (e) {
      console.error('error: ', e);
    }
  }
}

createSchema()
  .then(() => createDummyData())
  .catch((err) => {
    console.error(err);
  });

export { db, insertTexts };
