const {
  permissions: {
    objects: { ROLES },
    actions: { SELECT },
  },
} = require('../../../enums');
const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  method: 'POST',
  path: '/searchRoles',
  target: {
    object: ROLES,
    action: SELECT,
  },
  schema,
  handler,
};
