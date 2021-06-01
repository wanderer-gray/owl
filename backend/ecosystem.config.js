module.exports = {
  apps: [{
    name: 'owl',
    script: 'index.js',
    watch: true,
    watch_delay: 1000,
    ignore_watch: [
      '*.log',
      'node_modules',
    ],
    instances: -1,
    exec_mode: 'cluster',
    max_memory_restart: '100M',
    out_file: './out.log',
    error_file: './err.log',
    env: {
      NODE_ENV: 'development',
      APP_HOST: 'localhost',
      APP_PORT: 8080,
      RATE_MAX: 10,
      RATE_TIME: 1000,
      RATE_CACHE: 10000,
      KNEX_HOST: 'localhost',
      KNEX_PORT: 5432,
      KNEX_USER: 'admin',
      KNEX_PASSWORD: '123456',
      KNEX_DATABASE: 'owl',
      KNEX_POOL_MIN: 1,
      KNEX_POOL_MAX: 2,
    },
    env_production: {
      watch: false,
      NODE_ENV: 'production',
    },
  }],
};