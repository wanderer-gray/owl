const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  method: 'GET',
  path: '/search',
  schema,
  handler,
};
