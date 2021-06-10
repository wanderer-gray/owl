const { pass: { checkPassword } } = require('../utils');
const { toStr } = require('../../../utils');

module.exports = async function operation({ body }, { log, knex, httpErrors }, reply) {
  log.trace('login');
  log.debug(body);

  const {
    email,
    password,
  } = body;

  const auth = await knex('auths')
    .where({ email })
    .first('id', 'salt', 'hash');

  log.info(auth);

  if (!auth) {
    log.warn('auth not found');

    throw httpErrors.notFound();
  }

  const {
    id: userId,
    salt,
    hash,
  } = auth;

  const check = await checkPassword(password, salt, hash);

  if (!check) {
    log.warn('passwords don\'t match');

    throw httpErrors.forbidden();
  }

  reply.setCookie('userId', toStr(userId), {
    path: '/',
    sameSite: 'strict',
    signed: true,
    httpOnly: true,
  });
};
