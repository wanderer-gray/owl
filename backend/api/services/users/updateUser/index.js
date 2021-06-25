const {
  permissions: {
    objects: { USERS },
    actions: { UPDATE },
  },
} = require('../../../enums');
const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  tran: true,
  method: 'PUT',
  path: '/updateUser',
  target: {
    object: USERS,
    action: UPDATE,
  },
  schema,
  handler,
};
