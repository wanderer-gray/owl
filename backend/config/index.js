const crypto = require('crypto');

const COOKIE_SECRET = crypto.randomBytes(16).toString('hex');

module.exports = {
  app: {
    host: process.env.APP_HOST,
    port: process.env.APP_PORT,
  },
  sec: {
    rate: {
      max: process.env.RATE_MAX,
      timeWindow: process.env.RATE_TIME,
      cache: process.env.RATE_CACHE,
    },
  },
  api: {
    knex: {
      client: 'pg',
      connection: {
        host: process.env.KNEX_HOST,
        port: process.env.KNEX_PORT,
        user: process.env.KNEX_USER,
        password: process.env.KNEX_PASSWORD,
        database: process.env.KNEX_DATABASE,
      },
      pool: {
        min: Number(process.env.KNEX_POOL_MIN),
        max: Number(process.env.KNEX_POOL_MAX),
      },
      migrations: {
        tableName: 'migrations',
      },
    },
    cookie: {
      secret: COOKIE_SECRET,
    },
    password: {
      salt: process.env.PASS_SALT,
    },
  },
};
