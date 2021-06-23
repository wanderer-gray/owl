const { emailСonditions: { actions: { RESTORE } } } = require('../../../enums');
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
  log.trace('sendRestoreCode');
  log.debug(query);

  const email = query.email.trim();

  const allowEmail = await checkEmail(email, RESTORE, { knex });

  log.info(allowEmail);

  if (!allowEmail) {
    log.warn('email not allow');

    throw httpErrors.forbidden();
  }

  const code = getCode();
  log.info(code);
  const createAt = getDateISO();
  log.info(createAt);

  const queryFindUser = knex('users')
    .where({ email });

  const existsUser = await knexExists(queryFindUser, knex);

  log.info(existsUser);

  if (!existsUser) {
    log.warn('user not found');

    throw httpErrors.notFound();
  }

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
      subject: 'Восстановление пароля',
      text: `Код: ${code}`,
    }, { log, knex, httpErrors }),
  ]);
};
