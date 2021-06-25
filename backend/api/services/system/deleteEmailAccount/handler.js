module.exports = async function operation({ userId, query }, { log, knex, mailer }) {
  log.trace('deleteEmailAccount');
  log.debug(userId);
  log.debug(query);

  const { id } = query;

  await knex('emailAccounts')
    .where({ id })
    .del();

  await mailer.refreshAccounts({ log, knex });
};
