const {
  permissions: {
    objects: { GROUPS },
    actions: { CREATE },
  },
} = require('../../../enums');
const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  tran: true,
  method: 'POST',
  path: '/createGroup',
  target: {
    object: GROUPS,
    action: CREATE,
  },
  schema,
  handler,
};
