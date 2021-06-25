const {
  permissions: {
    objects: { SYSTEM },
    actions: { CREATE },
  },
} = require('../../../enums');
const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  tran: true,
  method: 'POST',
  path: '/createEmailAccount',
  target: {
    object: SYSTEM,
    action: CREATE,
  },
  schema,
  handler,
};
