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

  const unsignUserId = request.unsignCookie(signUserId);

  log.info(unsignUserId);

  if (!unsignUserId.valid) {
    return result;
  }

  result.isAuth = true;

  const userId = Number(unsignUserId.value);

  const queryCheckUserPermission = knex('userRoles')
    .join('rolePermissions', 'userRoles.roleId', '=', 'rolePermissions.roleId')
    .whereRaw('"permissions"."id" = "rolePermissions"."permissionId"')
    .where({ userId });

  const permissions = await knex('permissions')
    .where({
      global: true,
      permit: true,
    })
    .orWhereExists(queryCheckUserPermission)
    .select([
      'object',
      'action',
    ]);

  result.permissions = permissions;

  return result;
};
