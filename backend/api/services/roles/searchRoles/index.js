const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  method: 'POST',
  path: '/searchRoles',
  schema,
  handler,
};
