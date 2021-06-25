const {
  permissions: {
    objects: { SYSTEM },
    actions: { SELECT },
  },
} = require('../../../enums');
const handler = require('./handler');

module.exports = {
  method: 'GET',
  path: '/getGlobalPermissions',
  target: {
    object: SYSTEM,
    action: SELECT,
  },
  handler,
};
