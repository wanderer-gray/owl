const {
  permissions: {
    objects: { USERS },
    actions: { SELECT },
  },
} = require('../../../enums');
const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  method: 'GET',
  path: '/searchUsers',
  target: {
    object: USERS,
    action: SELECT,
  },
  schema,
  handler,
};
