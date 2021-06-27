const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  auth: false,
  method: 'POST',
  path: '/searchTests',
  schema,
  handler,
};
