/* eslint-disable no-shadow */
const path = require('path');
const fastifySensible = require('fastify-sensible');
const fastifyKnexJS = require('fastify-knexjs');
const fastifyCookie = require('fastify-cookie');
const fastifyAutoload = require('fastify-autoload');
const mailer = require('./plugins/mailer');

async function Service(props) {
  const {
    auth = true,
    operations,
  } = props;

  this.register(async (service) => {
    operations.forEach((operation) => {
      service.operation({ auth, ...operation });
    });
  });
}

async function Operation(props) {
  const {
    auth,
    tran = false,
    handler,
    ...router
  } = props;
  const {
    log,
    knex,
    mailer,
    httpErrors,
  } = this;

  if (auth) {
    router.preHandler = async function Authorization(request) {
      log.tarce('Authorization');
      log.debug(request.cookies);

      const signUserId = request.cookies.userId;

      log.info(signUserId);

      if (!signUserId) {
        log.warn('not authorized');

        throw this.httpErrors.unauthorized();
      }

      const result = request.unsignCookie(signUserId);

      log.info(result);

      if (!result.valid) {
        log.warn('not authorized');

        throw this.httpErrors.unauthorized();
      }

      request.userId = Number(result.value);
    };
  }

  router.handler = async function Handler(request, reply) {
    let result;

    const exts = {
      log,
      knex,
      mailer,
      httpErrors,
    };

    log.debug('begin handler');

    if (tran) {
      log.debug('begin transaction');

      await knex.transaction(async (trx) => {
        result = await handler(request, { ...exts, knex: trx }, reply);
      });

      log.debug('end transaction');
    } else {
      result = await handler(request, exts, reply);
    }

    reply.code(200);

    if (result) {
      reply.header('Content-Type', 'application/json; charset=utf-8');
    }

    reply.send(result);

    log.debug('end handler');
  };

  this.route(router);
}

module.exports = async (fastify, options) => {
  const { api } = options;

  await fastify.register(fastifySensible);
  await fastify.register(fastifyKnexJS, api.knex);
  await fastify.register(fastifyCookie, api.cookie);

  await fastify.knex.migrate.latest();

  await fastify.decorate('mailer', mailer);
  await fastify.decorate('service', Service);
  await fastify.decorate('operation', Operation);

  await fastify.register(fastifyAutoload, {
    dir: path.join(__dirname, 'services'),
    ignorePattern: /.utils/,
    maxDepth: 1,
    options: {
      prefix: '/api',
    },
  });
};
