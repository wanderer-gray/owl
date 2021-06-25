const {
  permissions: {
    objects: { ROLES },
    actions: { UPDATE },
  },
} = require('../../../enums');
const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  tran: true,
  method: 'PUT',
  path: '/updateRole',
  target: {
    object: ROLES,
    action: UPDATE,
  },
  schema,
  handler,
};
