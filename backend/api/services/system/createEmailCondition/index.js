const {
  permissions: {
    objects: { SYSTEM },
    actions: { CREATE },
  },
} = require('../../../enums');
const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  method: 'POST',
  path: '/createEmailCondition',
  target: {
    object: SYSTEM,
    action: CREATE,
  },
  schema,
  handler,
};
