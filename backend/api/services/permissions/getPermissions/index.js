const {
  permissions: {
    objects: { PERMISSIONS },
    actions: { SELECT },
  },
} = require('../../../enums');
const handler = require('./handler');

module.exports = {
  method: 'GET',
  path: '/getPermissions',
  target: {
    object: PERMISSIONS,
    action: SELECT,
  },
  handler,
};
