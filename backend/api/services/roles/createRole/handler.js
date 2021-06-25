module.exports = async function operation({ userId, body }, { log, knex }) {
  log.trace('createRole');
  log.debug(userId);
  log.debug(body);

  const {
    name,
    permissionIds,
  } = body;

  const [roleId] = await knex('roles')
    .insert({ name })
    .returning('id');

  log.info(roleId);

  const rolePermissions = permissionIds.map((permissionId) => ({
    roleId,
    permissionId,
  }));

  log.info(rolePermissions);

  if (rolePermissions.length) {
    await knex('rolePermissions')
      .insert(rolePermissions);
  }
};
