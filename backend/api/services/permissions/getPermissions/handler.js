module.exports = async function operation({ userId }, { log, knex }) {
  log.trace('getPermissions');
  log.debug(userId);

  const permissions = await knex('permissions')
    .select([
      'id',
      'object',
      'action',
    ]);

  return permissions;
};
