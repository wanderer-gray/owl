const toStr = (obj) => JSON.stringify(obj, null, '');

const getDateISO = (ms = 0) => new Date(Date.now() + ms).toISOString();

const knexExists = async (query, knex) => {
  const { result } = await knex.first(knex.raw('exists ? as result', query));

  return result;
};

const knexArrayAgg = (query, knex) => knex
  .from(query.as('vals'))
  .select(knex.raw('array_agg(row_to_json(vals))'));

const getCheckPermissions = async (userId, { log, knex }) => {
  log.trace('getCheckPermissions');

  const permissions = await knex('permissions')
    .join('rolePermissions', 'permissions.id', '=', 'rolePermissions.permissionId')
    .join('userRoles', 'rolePermissions.roleId', '=', 'userRoles.roleId')
    .where({ userId })
    .select([
      'object',
      'action',
    ]);

  log.debug(permissions);

  return (object, action) => permissions.some(
    (permission) => permission.object === object && permission.action === action,
  );
};

const getCheckGlobalPermissions = async ({ log, knex }) => {
  log.trace('getCheckGlobalPermissions');

  const globalPermissions = await knex('globalPermissions')
    .where({ permit: true })
    .select([
      'object',
      'action',
    ]);

  log.debug(globalPermissions);

  return (object, action) => globalPermissions.some(
    (permission) => permission.object === object && permission.action === action,
  );
};

module.exports = {
  toStr,
  getDateISO,
  knexExists,
  knexArrayAgg,
  getCheckPermissions,
  getCheckGlobalPermissions,
};
