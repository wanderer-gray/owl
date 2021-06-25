const {
  permissions: {
    objects: { SYSTEM },
    actions: { UPDATE },
  },
} = require('../../../enums');
const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  tran: true,
  method: 'PUT',
  path: '/updateEmailAccount',
  target: {
    object: SYSTEM,
    action: UPDATE,
  },
  schema,
  handler,
};
