const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  tran: true,
  method: 'PUT',
  path: '/updateGroup',
  schema,
  handler,
};
