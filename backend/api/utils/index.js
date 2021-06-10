const toStr = (obj) => JSON.stringify(obj, null, '');

const knexExists = async (query, knex) => {
  const { result } = await knex.first(knex.raw('exists ? as result', query));

  return result;
};

const getDateISO = (ms = 0) => new Date(Date.now() + ms).toISOString();

const getCheckPermissions = async (userId, { log, knex }) => {
  log.trace('getCheckPermissions');

  const permissions = await knex('permissions')
    .join('rolePermissions', 'permissions.id', '=', 'rolePermissions.permissionId')
    .join('authRoles', 'rolePermissions.roleId', '=', 'authRoles.roleId')
    .where({ authId: userId })
    .select([
      'object',
      'action',
    ]);

  log.debug(permissions);

  return (object, action) => permissions.some(
    (permission) => permission.object === object && permission.action === action,
  );
};

module.exports = {
  toStr,
  knexExists,
  getDateISO,
  getCheckPermissions,
};
