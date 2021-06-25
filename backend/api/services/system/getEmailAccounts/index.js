const {
  permissions: {
    objects: { SYSTEM },
    actions: { SELECT },
  },
} = require('../../../enums');
const handler = require('./handler');

module.exports = {
  method: 'GET',
  path: '/getEmailAccounts',
  target: {
    object: SYSTEM,
    action: SELECT,
  },
  handler,
};
