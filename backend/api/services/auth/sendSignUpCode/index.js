const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  tran: true,
  method: 'POST',
  path: '/sendSignUpCode',
  schema,
  handler,
  config: {
    rateLimit: {
      max: 1,
      timeWindow: 1000 * 10,
    },
  },
};
