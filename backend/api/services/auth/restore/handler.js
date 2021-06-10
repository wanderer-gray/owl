const {
  pass: {
    getSalt,
    getHash,
  },
} = require('../utils');
const {
  toStr,
  knexExists,
  getDateISO,
} = require('../../../utils');

module.exports = async function operation({ body }, { log, knex, httpErrors }, reply) {
  log.trace('restore');
  log.debug(body);

  const {
    email,
    code,
    password,
  } = body;

  const queryFindAuth = knex('auths')
    .where({ email });

  const [
    existsAuth,
    numberDeletedCodes,
  ] = await Promise.all([
    knexExists(queryFindAuth, knex),
    knex('authCodes')
      .where({ email, code })
      .where('createAt', '>', getDateISO(-1 * 1000 * 60 * 3))
      .del(),
  ]);

  log.info(existsAuth, numberDeletedCodes);

  if (!existsAuth) {
    log.warn('auth email is not exists');

    throw httpErrors.notFound();
  }

  if (!numberDeletedCodes) {
    log.warn('auth code not found');

    throw httpErrors.notFound();
  }

  const salt = getSalt();
  log.info(salt);
  const hash = await getHash(password, salt);
  log.info(hash);

  const userId = await knex('auths')
    .where({ email })
    .update({
      salt,
      hash,
    })
    .returning('id');

  log.info(userId);

  reply.setCookie('userId', toStr(userId), {
    path: '/',
    sameSite: 'strict',
    signed: true,
    httpOnly: true,
  });
};
