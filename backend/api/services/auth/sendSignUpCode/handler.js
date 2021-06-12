const {
  mail: { checkEmail },
  code: { getCode },
} = require('../utils');
const {
  knexExists,
  getDateISO,
} = require('../../../utils');

module.exports = async function operation({ query }, {
  log, knex, httpErrors, mailer,
}) {
  log.trace('sendSignUpCode');
  log.debug(query);

  const email = query.email.trim();

  const queryFindAuth = knex('auths')
    .where({ email });

  const [
    allowEmail,
    existsAuth,
  ] = await Promise.all([
    checkEmail(email, knex),
    knexExists(queryFindAuth, knex),
  ]);

  if (!allowEmail) {
    log.warn('email not allow');

    throw httpErrors.forbidden();
  }

  if (existsAuth) {
    log.warn('auth email is exists');

    throw httpErrors.conflict();
  }
  const code = getCode();
  const createAt = getDateISO();

  // @todo объеденить в один промис
  await knex('authCodes')
    .insert({
      email,
      code,
      createAt,
    })
    .onConflict('email')
    .merge();

  console.log(await mailer({
    to: email,
    subject: 'Регистрация',
    text: `Код: ${code}`,
  }, { log, knex, httpErrors }));
};