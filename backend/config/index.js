const crypto = require('crypto');

const COOKIE_SECRET = crypto.randomBytes(16);

const config = {
  development: {
    app: {
      host: 'localhost',
      port: 8000,
    },
    sec: {
      rate: {
        max: 10,
        timeWindow: 1000,
        cache: 10000,
      },
    },
    api: {
      knex: {
        client: 'pg',
        connection: {
          host: 'localhost',
          port: 5432,
          user: 'admin',
          password: '123456',
          database: 'owl',
        },
        pool: {
          min: 2,
          max: 10,
        },
        migrations: {
          tableName: 'migrations',
        },
      },
      cookie: {
        secret: COOKIE_SECRET,
      },
    },
  },
  production: {
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
          min: process.env.KNEX_POOL_MIN,
          max: process.env.KNEX_POOL_MAX,
        },
        migrations: {
          tableName: 'migrations',
        },
      },
      cookie: {
        secret: COOKIE_SECRET,
      },
    },
  },
};

module.exports = config[process.env.NODE_ENV || 'development'];
