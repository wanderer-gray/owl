const {
  permissions: {
    objects: { GROUPS },
    actions: { UPDATE },
  },
} = require('../../../enums');
const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  tran: true,
  method: 'PUT',
  path: '/updateGroup',
  target: {
    object: GROUPS,
    action: UPDATE,
  },
  schema,
  handler,
};
