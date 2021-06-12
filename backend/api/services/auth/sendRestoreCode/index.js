const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  tran: true,
  method: 'POST',
  path: '/sendRestoreCode',
  schema,
  handler,
  config: {
    max: 1,
    timeWindow: 1000 * 10,
  },
};