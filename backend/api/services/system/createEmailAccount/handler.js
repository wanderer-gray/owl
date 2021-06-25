module.exports = async function operation({ userId, body }, { log, knex, mailer }) {
  log.trace('createEmailAccount');
  log.debug(userId);
  log.debug(body);

  const {
    host,
    port,
    secure,
    user,
    pass,
  } = body;

  await knex('emailAccounts')
    .insert({
      host,
      port,
      secure,
      user,
      pass,
    });

  await mailer.refreshAccounts({ log, knex });
};
