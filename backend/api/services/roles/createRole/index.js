const {
  permissions: {
    objects: { ROLES },
    actions: { CREATE },
  },
} = require('../../../enums');
const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  tran: true,
  method: 'POST',
  path: '/createRole',
  target: {
    object: ROLES,
    action: CREATE,
  },
  schema,
  handler,
};
