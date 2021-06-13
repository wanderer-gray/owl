const {
  pass: {
    checkPassword,
    getSalt,
    getHash,
  },
} = require('../../auth/utils');

module.exports = async function operation({ userId, body }, { log, knex, httpErrors }) {
  log.trace('updatePassword');
  log.debug(userId);
  log.debug(body);

  const {
    oldPassword,
    newPassword,
  } = body;

  const user = await knex('users')
    .where({ id: userId })
    .first('salt', 'hash');

  log.info(user);

  if (!user) {
    log.warn('user not found');

    throw httpErrors.notFound();
  }

  let {
    salt,
    hash,
  } = user;

  const check = await checkPassword(oldPassword, salt, hash);

  log.info(check);

  if (!check) {
    log.warn('passwords don\'t match');

    throw httpErrors.forbidden();
  }

  salt = getSalt();
  log.info(salt);
  hash = await getHash(newPassword, salt);
  log.info(hash);

  await knex('users')
    .where({ id: userId })
    .update({
      salt,
      hash,
    });
};
