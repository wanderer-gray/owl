const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  tran: true,
  method: 'DELETE',
  path: '/deleteRole',
  schema,
  handler,
};
