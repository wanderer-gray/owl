const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  method: 'PUT',
  path: '/setAnswer',
  schema,
  handler,
};
