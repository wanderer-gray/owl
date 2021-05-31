const searchUsers = require('./searchUsers');

module.exports = async (fastify) => fastify.service({
  operations: [
    searchUsers,
  ],
});
