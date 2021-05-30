const {
  development,
  production,
} = require('./config');

module.exports = {
  development: development.knex,
  production: production.knex,
};
