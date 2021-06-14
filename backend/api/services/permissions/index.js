const getPermissions = require('./getPermissions');

module.exports = (fastify) => fastify.service({
  operations: [
    getPermissions,
  ],
});
