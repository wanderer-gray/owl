const searchUsers = require('./searchUsers');

module.exports = async (fastify) => {
  fastify.register(async (service) => {
    service.operation(searchUsers);
  });
};
