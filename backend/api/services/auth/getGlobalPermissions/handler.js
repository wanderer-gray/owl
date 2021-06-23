module.exports = async function operation(_, { log, knex }) {
  log.trace('getGlobalPermissions');

  const globalPermissions = await knex('globalPermissions')
    .where({ permit: true })
    .select([
      'object',
      'action',
    ]);

  return globalPermissions;
};
