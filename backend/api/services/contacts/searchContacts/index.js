const {
  permissions: {
    objects: { CONTACTS },
    actions: { SELECT },
  },
} = require('../../../enums');
const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  method: 'POST',
  path: '/searchContacts',
  target: {
    object: CONTACTS,
    action: SELECT,
  },
  schema,
  handler,
};
