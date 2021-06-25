const {
  permissions: {
    objects: { SYSTEM },
    actions: { DELETE },
  },
} = require('../../../enums');
const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  method: 'DELETE',
  path: '/deleteEmailCondition',
  target: {
    object: SYSTEM,
    action: DELETE,
  },
  schema,
  handler,
};
