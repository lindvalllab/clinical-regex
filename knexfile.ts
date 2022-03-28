import type { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'sqlite3',
    migrations: {
      tableName: 'knex_migrations',
      directory: 'src/electron/migrations/',
    },
  },
};

module.exports = config;
