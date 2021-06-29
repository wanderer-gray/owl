const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  tran: true,
  method: 'GET',
  path: '/getTest',
  schema,
  handler,
};
