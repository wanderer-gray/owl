const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  method: 'POST',
  path: '/login',
  schema,
  handler,
  config: {
    rateLimit: {
      max: 1,
      timeWindow: 1000,
    },
  },
};
