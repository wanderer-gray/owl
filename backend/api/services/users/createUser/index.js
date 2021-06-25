const {
  permissions: {
    objects: { USERS },
    actions: { CREATE },
  },
} = require('../../../enums');
const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  tran: true,
  method: 'POST',
  path: '/createUser',
  target: {
    object: USERS,
    action: CREATE,
  },
  schema,
  handler,
};
