const {
  permissions: {
    objects: { SYSTEM },
    actions: { UPDATE },
  },
} = require('../../../enums');
const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  method: 'PUT',
  path: '/updateGlobalPermission',
  target: {
    object: SYSTEM,
    action: UPDATE,
  },
  schema,
  handler,
};
