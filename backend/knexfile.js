const {
  api: {
    knex,
  },
} = require('./config');

module.exports = {
  development: knex,
  production: knex,
};
