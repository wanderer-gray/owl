const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  tran: true,
  method: 'PUT',
  path: '/setConfig',
  schema,
  handler,
};
