module.exports = async function operation({ userId }, { log, knex }) {
  log.trace('getGlobalPermissions');
  log.debug(userId);

  const globalPermissions = await knex('permissions')
    .where({ global: true })
    .select('*')
    .orderBy([
      'object',
      'action',
    ]);

  log.debug(globalPermissions);

  return globalPermissions;
};
