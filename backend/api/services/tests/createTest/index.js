const {
  permissions: {
    objects: { TESTS },
    actions: { CREATE },
  },
} = require('../../../enums');
const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  tran: true,
  method: 'POST',
  path: '/createTest',
  target: {
    object: TESTS,
    action: CREATE,
  },
  schema,
  handler,
};
