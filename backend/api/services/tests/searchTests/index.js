const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  auth: false,
  method: 'GET',
  path: '/searchTests',
  schema,
  handler,
};
