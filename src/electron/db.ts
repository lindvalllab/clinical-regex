import { app, ipcRenderer } from 'electron';
import { knex } from 'knex';
import { Model, PartialModelObject } from 'objection';
import path from 'path';

const db = knex({
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: async () => {
    let userDataPath;

    // app is not available in renderer process,
    // use an ipc handler as a fallback (this may
    // be called from either process)
    // Reference: https://stackoverflow.com/a/65576869
    if (app !== undefined) {
      userDataPath = app.getPath('userData');
    } else {
      userDataPath = await ipcRenderer.invoke('electron:userDataPath');
    }

    const filename = path.join(userDataPath, 'db.sqlite');
    console.info(`Connected to database: ${filename}`);

    return {
      filename: filename,
    };
  },
});

// Give the knex instance to objection
Model.knex(db);

export class TextModel extends Model {
  group_id?: string;
  id?: number;
  text?: string;
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
  await TextModel.query().insert({
    group_id: 0,
    text: 'this is an example text',
  } as PartialModelObject<TextModel>);
}

createSchema()
  .then(() => createDummyData())
  .catch((err) => {
    console.error(err);
  });

export { db };
