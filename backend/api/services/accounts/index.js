const getProfile = require('./getProfile');

module.exports = async (fastify) => fastify.service({
  operations: [
    getProfile,
  ],
});
