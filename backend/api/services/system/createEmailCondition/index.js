const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  method: 'POST',
  path: '/createEmailCondition',
  schema,
  handler,
};
