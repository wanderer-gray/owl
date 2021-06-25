module.exports = async function operation({ userId }, { log, knex }) {
  log.trace('getGlobalPermissions');
  log.debug(userId);

  const globalPermissions = await knex('permissions')
    .where({ global: true })
    .select([
      'id',
      'object',
      'action',
      'permit',
    ])
    .orderBy([
      'object',
      'action',
    ]);

  log.debug(globalPermissions);

  return globalPermissions;
};
