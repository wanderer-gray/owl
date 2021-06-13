const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  method: 'DELETE',
  path: '/deleteRole',
  schema,
  handler,
};
