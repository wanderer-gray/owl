const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  auth: true,
  method: 'DELETE',
  path: '/deleteAnswers',
  schema,
  handler,
};
