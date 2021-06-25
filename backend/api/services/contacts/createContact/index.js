const {
  permissions: {
    objects: { CONTACTS },
    actions: { CREATE },
  },
} = require('../../../enums');
const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  tran: true,
  method: 'POST',
  path: '/createContact',
  target: {
    object: CONTACTS,
    action: CREATE,
  },
  schema,
  handler,
};
