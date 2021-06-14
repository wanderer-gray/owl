module.exports = async function operation(request, { log, knex }) {
  log.trace('getPermissions');
  log.debug(request.cookies);

  const signUserId = request.cookies.userId;

  log.info(signUserId);

  if (!signUserId) {
    return [];
  }

  const result = request.unsignCookie(request.cookies.userId);

  log.info(result);

  if (!result.valid) {
    return [];
  }

  const userId = Number(result.value);

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
