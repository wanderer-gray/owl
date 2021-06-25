const {
  permissions: {
    objects: { USERS },
    actions: { DELETE },
  },
} = require('../../../enums');
const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  method: 'DELETE',
  path: '/deleteUser',
  target: {
    object: USERS,
    action: DELETE,
  },
  schema,
  handler,
};
