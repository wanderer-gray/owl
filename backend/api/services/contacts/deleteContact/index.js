const {
  permissions: {
    objects: { CONTACTS },
    actions: { DELETE },
  },
} = require('../../../enums');
const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  method: 'DELETE',
  path: '/deleteContact',
  target: {
    object: CONTACTS,
    action: DELETE,
  },
  schema,
  handler,
};
