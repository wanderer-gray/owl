const {
  permissions: {
    objects: { SYSTEM },
    actions: { DELETE },
  },
} = require('../../../enums');
const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  tran: true,
  method: 'DELETE',
  path: '/deleteEmailAccount',
  target: {
    object: SYSTEM,
    action: DELETE,
  },
  schema,
  handler,
};
