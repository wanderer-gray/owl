const { emailСonditions: { actions: { SIGNUP } } } = require('../../../enums');
const {
  mail: { checkEmail },
  code: { getCode },
} = require('../utils');
const {
  knexExists,
  getDateISO,
  getCallbackThen,
  getCallbackCatch,
} = require('../../../utils');

module.exports = async function operation({ query }, {
  log, knex, httpErrors, mailer,
}) {
  log.trace('sendSignUpCode');
  log.debug(query);

  const email = query.email.trim();

  const allowEmail = await checkEmail(email, SIGNUP, { knex });

  log.info(allowEmail);

  if (!allowEmail) {
    log.warn('email not allow');

    throw httpErrors.locked();
  }

  const queryFindUser = knex('users')
    .where({ email });

  const existsUser = await knexExists(queryFindUser, knex);

  log.info(existsUser);

  if (existsUser) {
    log.warn('email is exists');

    throw httpErrors.conflict();
  }

  const code = getCode();
  log.info(code);
  const createAt = getDateISO();
  log.info(createAt);

  await knex('codes')
    .insert({
      email,
      code,
      createAt,
    })
    .onConflict('email')
    .merge();

  mailer
    .sendMail({
      subject: 'Регистрация',
      to: email,
      text: `Код: ${code}`,
    }, {
      log,
      httpErrors,
    })
    .then(getCallbackThen({ log }))
    .catch(getCallbackCatch({ log }));
};
