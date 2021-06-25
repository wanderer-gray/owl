const {
  permissions: {
    objects: { TESTS },
    actions: { DELETE },
  },
} = require('../../../../enums');
const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  method: 'DELETE',
  path: '/deleteTest',
  target: {
    object: TESTS,
    action: DELETE,
  },
  schema,
  handler,
};
