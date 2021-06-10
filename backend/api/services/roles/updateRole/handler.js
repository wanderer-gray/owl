const {
  objects: { ROLES },
  actions: { UPDATE },
} = require('../../../enums');
const {
  getCheckPermissions,
  knexExists,
} = require('../../../utils');

module.exports = async function operation({ userId, query, body }, { log, knex, httpErrors }) {
  log.trace('updateRole');
  log.debug(userId);
  log.debug(query);
  log.debug(body);

  const { id } = query;
  const {
    name,
    permissionIds,
  } = body;

  const checkPermissions = await getCheckPermissions(userId, { log, knex });

  if (!checkPermissions(ROLES, UPDATE)) {
    log.warn('no permission to update a role');

    throw httpErrors.forbidden();
  }

  const queryFindRole = knex('roles')
    .where({ id });

  const existsRole = await knexExists(queryFindRole, knex);

  if (!existsRole) {
    log.warn('role is not exists');

    throw httpErrors.notFound();
  }

  if (name !== undefined) {
    await knex('roles')
      .where({ id })
      .update({ name });
  }

  if (permissionIds !== undefined) {
    await knex('rolePermissions')
      .where({ roleId: id })
      .del();

    const rolePermissions = permissionIds.map((permissionId) => ({
      roleId: id,
      permissionId,
    }));

    log.info(rolePermissions);

    await knex('rolePermissions')
      .insert(rolePermissions);
  }
};
