const {
  permissions: {
    objects: { ROLES },
    actions: { CREATE },
  },
} = require('../../../enums');
const { getCheckPermissions } = require('../../../utils');

module.exports = async function operation({ userId, body }, { log, knex, httpErrors }) {
  log.trace('createRole');
  log.debug(userId);
  log.debug(body);

  const {
    name,
    permissionIds,
  } = body;

  const checkPermissions = await getCheckPermissions(userId, { log, knex });

  if (!checkPermissions(ROLES, CREATE)) {
    log.warn('no permission to create a role');

    throw httpErrors.forbidden();
  }

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
