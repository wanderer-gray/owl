module.exports = async function operation({ userId }, { log, knex }) {
  log.trace('getEmailAccounts');
  log.debug(userId);

  const accounts = await knex('emailAccounts')
    .select('*')
    .orderBy([
      'host',
      'id',
    ]);

  log.info(accounts);

  return accounts;
};
