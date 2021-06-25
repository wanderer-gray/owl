module.exports = async function operation({ userId, query, body }, {
  log, knex, mailer, httpErrors,
}) {
  log.trace('updateEmailAccount');
  log.debug(userId);
  log.debug(query);
  log.debug(body);

  const { id } = query;
  const {
    host,
    port,
    secure,
    user,
    pass,
  } = body;

  const numberUpdatedAccounts = await knex('emailAccounts')
    .where({ id })
    .update({
      host,
      port,
      secure,
      user,
      pass,
    });

  if (!numberUpdatedAccounts) {
    log.warn('account not found');

    throw httpErrors.notFound();
  }

  await mailer.refreshAccounts({ log, knex });
};
