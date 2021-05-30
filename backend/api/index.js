const path = require('path');
const fastifySensible = require('fastify-sensible');
const fastifyKnexJS = require('fastify-knexjs');
const fastifyCookie = require('fastify-cookie');
const fastifyAutoload = require('fastify-autoload');

module.exports = async (fastify, options) => {
  const { api } = options;

  fastify.register(fastifySensible);
  fastify.register(fastifyKnexJS, api.knex);
  fastify.register(fastifyCookie, api.cookie);

  fastify.decorate('operation', function (props) {
    const {
      transaction = false,
      authorization = true,
      handler,
      ...route
    } = props;

    if (authorization) {
      route.preHandler = async function (request) {
        const { userId } = request.cookies;

        if (!userId) {
          throw this.httpErrors.unauthorized();
        }

        request.userId = userId;
      };
    }

    route.handler = async function (request) {
      let result;
      const { log, knex } = this;

      if (transaction) {
        await knex.transaction(async (trx) => {
          result = await handler(request, { log, knex: trx });
        });
      } else {
        result = await handler(request, { log, knex });
      }

      return result;
    };

    this.route(route);
  });

  fastify.register(fastifyAutoload, {
    dir: path.join(__dirname, 'services'),
  });
};
