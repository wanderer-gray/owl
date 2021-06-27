const {
  permissions: {
    objects: { TESTS },
    actions: { UPDATE },
  },
} = require('../../../enums');
const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  tran: true,
  method: 'PUT',
  path: '/updateTest',
  target: {
    object: TESTS,
    action: UPDATE,
  },
  schema,
  handler,
};
