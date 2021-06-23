const { emailСonditions: { actions: { SIGNUP } } } = require('../../../enums');
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

  const allowEmail = await checkEmail(email, SIGNUP, { knex });

  log.info(allowEmail);

  if (!allowEmail) {
    log.warn('email not allow');

    throw httpErrors.forbidden();
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

  await Promise.all([
    knex('codes')
      .insert({
        email,
        code,
        createAt,
      })
      .onConflict('email')
      .merge(),
    mailer.sendMail({
      to: email,
      subject: 'Регистрация',
      text: `Код: ${code}`,
    }, { log, knex, httpErrors }),
  ]);
};
