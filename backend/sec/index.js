const fastifyRateLimit = require('fastify-rate-limit');

module.exports = async (fastify, options) => {
  const { sec } = options;

  fastify.register(fastifyRateLimit, sec.rate);
};
