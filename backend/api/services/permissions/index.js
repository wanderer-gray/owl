const getPermissions = require('./getPermissions');

module.exports = async (fastify) => fastify.service({
  operations: [
    getPermissions,
  ],
});
