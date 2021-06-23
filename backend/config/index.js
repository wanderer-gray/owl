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
        host: process.env.KNEX_HOST || 'localhost',
        port: process.env.KNEX_PORT || 5432,
        user: process.env.KNEX_USER || 'admin',
        password: process.env.KNEX_PASSWORD || '123456',
        database: process.env.KNEX_DATABASE || 'owl',
      },
      pool: {
        min: Number(process.env.KNEX_POOL_MIN || 1),
        max: Number(process.env.KNEX_POOL_MAX || 2),
      },
      migrations: {
        tableName: 'migrations',
      },
    },
    cookie: {
      secret: COOKIE_SECRET,
    },
    password: {
      salt: process.env.PASS_SALT || 'dFo6tfbrcbr1Whv2pbuNiQwkTobRKspP',
    },
  },
};
