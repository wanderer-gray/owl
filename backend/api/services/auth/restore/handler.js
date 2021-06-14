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

  const queryFindUser = knex('users')
    .where({ email });

  const existsUser = await knexExists(queryFindUser, knex);

  log.info(existsUser);

  if (!existsUser) {
    log.warn('user not found');

    throw httpErrors.notFound();
  }

  const numberDeletedCodes = await knex('codes')
    .where({ email, code })
    .where('createAt', '>', getDateISO(-1 * 1000 * 60 * 3)) // Если токену < 3 минут
    .del();

  log.info(numberDeletedCodes);

  if (!numberDeletedCodes) {
    log.warn('code not found');

    throw httpErrors.notFound();
  }

  const salt = getSalt();
  log.info(salt);
  const hash = await getHash(password, salt);
  log.info(hash);

  const [userId] = await knex('users')
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
    maxAge: 60 * 60 * 24 * 7, // one week
  });
};
