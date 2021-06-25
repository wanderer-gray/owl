const {
  permissions: {
    objects: { GROUPS },
    actions: { DELETE },
  },
} = require('../../../enums');
const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  method: 'DELETE',
  path: '/deleteGroup',
  target: {
    object: GROUPS,
    action: DELETE,
  },
  schema,
  handler,
};
