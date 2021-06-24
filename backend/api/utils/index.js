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

  const userPermissions = knex('permissions')
    .join('rolePermissions', 'permissions.id', '=', 'rolePermissions.permissionId')
    .join('userRoles', 'rolePermissions.roleId', '=', 'userRoles.roleId')
    .where({ userId })
    .select([
      'object',
      'action',
    ]);

  const globalPermissions = knex('globalPermissions')
    .where({ permit: true })
    .select([
      'object',
      'action',
    ]);

  const permissions = await userPermissions.union([globalPermissions]);

  log.debug(permissions);

  return (object, action) => permissions.some(
    (permission) => permission.object === object && permission.action === action,
  );
};

module.exports = {
  toStr,
  getDateISO,
  knexExists,
  knexArrayAgg,
  getCheckPermissions,
};
