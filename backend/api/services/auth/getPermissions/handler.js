module.exports = async function operation(request, { log, knex }) {
  log.trace('getPermissions');
  log.debug(request.cookies);

  const { userId } = request.cookies;

  if (!userId) {
    return [];
  }

  const permissions = await knex('permissions')
    .join('rolePermissions', 'permissions.id', '=', 'rolePermissions.permissionId')
    .join('userRoles', 'rolePermissions.roleId', '=', 'userRoles.roleId')
    .where({ userId })
    .select([
      'object',
      'action',
    ]);

  return permissions;
};
