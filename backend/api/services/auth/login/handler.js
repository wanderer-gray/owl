const { emailСonditions: { actions: { LOGIN } } } = require('../../../enums');
const {
  mail: { checkEmail },
  pass: { checkPassword },
} = require('../utils');
const { toStr } = require('../../../utils');

module.exports = async function operation({ body }, { log, knex, httpErrors }, reply) {
  log.trace('login');
  log.debug(body);

  const email = body.email.trim();
  const { password } = body;

  const allowEmail = await checkEmail(email, LOGIN, { knex });

  log.info(allowEmail);

  if (!allowEmail) {
    log.warn('email not allow');

    throw httpErrors.locked();
  }

  const user = await knex('users')
    .where({ email })
    .first('id', 'salt', 'hash');

  log.info(user);

  if (!user) {
    log.warn('user not found');

    throw httpErrors.notFound();
  }

  const {
    id: userId,
    salt,
    hash,
  } = user;

  const check = await checkPassword(password, salt, hash);

  log.info(check);

  if (!check) {
    log.warn('passwords don\'t match');

    throw httpErrors.forbidden();
  }

  reply.setCookie('userId', toStr(userId), {
    path: '/',
    sameSite: 'strict',
    signed: true,
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // one week
  });
};
