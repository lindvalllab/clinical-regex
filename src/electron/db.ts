import { app, ipcRenderer } from 'electron';
import { Knex, knex } from 'knex';
import { Model, RelationMapping } from 'objection';
import path from 'path';

export class TextModel extends Model {
  id!: number;
  group_id!: string;
  text!: string;

  // for using eager loading methods
  annotation!: AnnotationModel;
  matches!: MatchModel[];

  static get tableName(): string {
    return 'texts';
  }

  static get relationMappings(): {
    annotation: RelationMapping<AnnotationModel>;
    matches: RelationMapping<MatchModel>;
  } {
    return {
      annotation: {
        relation: Model.BelongsToOneRelation,
        modelClass: AnnotationModel,
        join: {
          from: 'texts.group_id',
          to: 'annotations.group_id',
        },
      },
      matches: {
        relation: Model.HasManyRelation,
        modelClass: MatchModel,
        join: {
          from: 'texts.id',
          to: 'matches.text_id',
        },
      },
    };
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

export class MatchModel extends Model {
  id!: number;
  text_id!: number;
  label!: string;
  start!: number;
  length!: number;

  // for using eager loading methods
  text!: TextModel;

  static get tableName(): string {
    return 'matches';
  }

  static get relationMappings(): {
    text: RelationMapping<TextModel>;
  } {
    return {
      text: {
        relation: Model.BelongsToOneRelation,
        modelClass: TextModel,
        join: {
          from: 'matches.text_id',
          to: 'texts.id',
        },
      },
    };
  }
}

const getTempDbPath = async (): Promise<string> => {
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

  return path.join(userDataPath, 'temp.cr');
};

const initDb = async (filename?: string): Promise<void> => {
  const db = knex({
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: async () => {
      if (filename === undefined) filename = await getTempDbPath();
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
        table.unique(['group_id', 'label']);
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

    if (!(await db.schema.hasTable('matches'))) {
      await db.schema.createTable('matches', (table) => {
        table.increments('id').primary();
        table
          .integer('text_id')
          .references('id')
          .inTable('texts')
          .notNullable();
        table
          .string('label')
          .references('name')
          .inTable('labels')
          .notNullable();
        table.integer('start').notNullable();
        table.integer('length').notNullable();
      });
    }
  }

  try {
    await createSchema();
  } catch (err) {
    console.error(err);
  }
};

export async function isDbBroken(filename: string): Promise<boolean> {
  // Check if the database with the given filename was initialized incorrectly.
  const db = knex({
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: async () => {
      return {
        filename: filename,
      };
    },
  });
  const hasTables = (
    await Promise.all([
      db.schema.hasTable('texts'),
      db.schema.hasTable('annotations'),
      db.schema.hasTable('labels'),
      db.schema.hasTable('settings'),
      db.schema.hasTable('matches'),
    ])
  ).every((x) => x);

  if (!hasTables) {
    await db.destroy();
    return true;
  }

  // If any of the texts, labels, matches, or settings tables are empty and if there
  // are no annotations, we assume that the project was not initialized properly.
  const hasData =
    (
      await Promise.all([
        db('texts').count('* as count'),
        db('labels').count('* as count'),
        db('matches').count('* as count'),
        db('settings').count('* as count'),
      ])
    ).every((x) => x[0]['count'] > 0) ||
    (await db('annotations').count('* as count'))[0]['count'] > 0;

  await db.destroy();
  return !hasData;
}

export const getKnexDb = (): Knex => Model.knex();

export { getTempDbPath, initDb };
