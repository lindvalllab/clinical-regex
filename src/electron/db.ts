import { app, ipcRenderer } from 'electron';
import { knex } from 'knex';
import { Model } from 'objection';
import path from 'path';

export class TextModel extends Model {
  id!: number;
  group_id!: string;
  text!: string;
  static get tableName(): string {
    return 'texts';
  }
}

export class LabelModel extends Model {
  id!: number;
  name!: string;
  pattern!: string;
  static get tableName(): string {
    return 'labels';
  }
}

export class AnnotationModel extends Model {
  id!: number;
  group_id!: string;
  label!: string;
  value!: number;
  static get tableName(): string {
    return 'annotations';
  }
}

export class SettingsModel extends Model {
  id!: number;
  IS_GROUPED!: number | boolean;
  GROUP_ID_FIELD!: string | null;
  TEXT_ID_FIELD!: string;
  static get tableName(): string {
    return 'settings';
  }
}

const getDbPath = async (): Promise<string> => {
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

  return path.join(userDataPath, 'db.sqlite');
};

const initDb = (): void => {
  const db = knex({
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: async () => {
      const filename = await getDbPath();
      console.info(`Connected to database: ${filename}`);

      return {
        filename: filename,
      };
    },
  });

  // Give the knex instance to objection
  Model.knex(db);

  async function createSchema() {
    if (!(await db.schema.hasTable('texts'))) {
      await db.schema.createTable('texts', (table) => {
        table.increments('id').primary();
        table.string('group_id').notNullable();
        table.text('text').notNullable();
      });
    }

    if (!(await db.schema.hasTable('labels'))) {
      await db.schema.createTable('labels', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.text('pattern').notNullable();
      });
    }

    if (!(await db.schema.hasTable('annotations'))) {
      await db.schema.createTable('annotations', (table) => {
        table.increments('id').primary();
        table
          .string('group_id')
          .references('group_id')
          .inTable('texts')
          .notNullable();
        table
          .string('label')
          .references('name')
          .inTable('labels')
          .notNullable();
        table.integer('value').notNullable();
      });
    }

    if (!(await db.schema.hasTable('settings'))) {
      await db.schema.createTable('settings', (table) => {
        table.increments('id').primary();
        table.integer('IS_GROUPED').notNullable();
        table.string('GROUP_ID_FIELD');
        table.string('TEXT_ID_FIELD').notNullable();
      });
    }
  }

  createSchema().catch((err) => {
    console.error(err);
  });
};

export { getDbPath, initDb };
