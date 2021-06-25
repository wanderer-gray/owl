const {
  permissions: {
    objects: { SYSTEM },
    actions: { SELECT },
  },
} = require('../../../enums');
const schema = require('./schema');
const handler = require('./handler');

module.exports = {
  method: 'GET',
  path: '/getEmailConditions',
  target: {
    object: SYSTEM,
    action: SELECT,
  },
  schema,
  handler,
};
