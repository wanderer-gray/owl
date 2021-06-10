const {
  pass: {
    getSalt,
    getHash,
  },
} = require('../utils');
const {
  toStr,
  getDateISO,
} = require('../../../utils');

module.exports = async function operation({ body }, { log, knex, httpErrors }, reply) {
  log.trace('signup');
  log.debug(body);

  const {
    email,
    code,
    password,
  } = body;

  const numberDeletedCodes = await knex('authCodes')
    .where({ email, code })
    .where('createAt', '>', getDateISO(-1 * 1000 * 60 * 3))
    .del();

  log.info(numberDeletedCodes);

  if (!numberDeletedCodes) {
    log.warn('auth code not found');

    throw httpErrors.notFound();
  }

  const salt = getSalt();
  log.info(salt);
  const hash = await getHash(password, salt);
  log.info(hash);

  const userId = await knex('auths')
    .insert({
      email,
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
