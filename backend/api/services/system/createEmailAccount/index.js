const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  tran: true,
  method: 'POST',
  path: '/createEmailAccount',
  schema,
  handler,
};
