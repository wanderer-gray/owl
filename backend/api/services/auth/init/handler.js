module.exports = async function operation(request, { log, knex }) {
  log.trace('init');
  log.debug(request.cookies);

  const result = {
    isAuth: false,
    permissions: [],
  };

  const signUserId = request.cookies.userId;

  log.info(signUserId);

  if (!signUserId) {
    return result;
  }

  const unsignUserId = request.unsignCookie(request.cookies.userId);

  log.info(unsignUserId);

  if (!unsignUserId.valid) {
    return result;
  }

  result.isAuth = true;

  const userId = Number(unsignUserId.value);

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

  result.permissions = permissions;

  return result;
};
