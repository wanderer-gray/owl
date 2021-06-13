const { pass: { checkPassword } } = require('../../auth/utils');

module.exports = async function operation({ userId, body }, { log, knex, httpErrors }, reply) {
  log.trace('deleteAccount');
  log.debug(userId);
  log.debug(body);

  const { password } = body;

  const user = await knex('users')
    .where({ id: userId })
    .first('salt', 'hash');

  log.info(user);

  if (!user) {
    log.warn('user not found');

    throw httpErrors.notFound();
  }

  const {
    salt,
    hash,
  } = user;

  const check = await checkPassword(password, salt, hash);

  log.info(check);

  if (!check) {
    log.warn('passwords don\'t match');

    throw httpErrors.forbidden();
  }

  await knex('users')
    .where({ id: userId })
    .del();

  reply.clearCookie('userId');
};
