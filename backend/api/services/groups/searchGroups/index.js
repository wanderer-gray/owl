const {
  permissions: {
    objects: { GROUPS },
    actions: { SELECT },
  },
} = require('../../../enums');
const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  method: 'POST',
  path: '/searchGroups',
  target: {
    object: GROUPS,
    action: SELECT,
  },
  schema,
  handler,
};
