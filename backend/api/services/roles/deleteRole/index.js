const {
  permissions: {
    objects: { ROLES },
    actions: { DELETE },
  },
} = require('../../../enums');
const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  method: 'DELETE',
  path: '/deleteRole',
  target: {
    object: ROLES,
    action: DELETE,
  },
  schema,
  handler,
};
