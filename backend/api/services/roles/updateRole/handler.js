const {
  objects: { ROLES },
  actions: { UPDATE },
} = require('../../../enums');
const {
  getCheckPermissions,
  knexExists,
} = require('../../../utils');

const updateName = async (id, name, { knex }) => {
  if (name === undefined) {
    return;
  }

  await knex('roles')
    .where({ id })
    .update({ name });
};

const updatePermissions = async (id, permissionIds, { log, knex }) => {
  if (permissionIds === undefined) {
    return;
  }

  await knex('rolePermissions')
    .where({ roleId: id })
    .del();

  const rolePermissions = permissionIds.map((permissionId) => ({
    roleId: id,
    permissionId,
  }));

  log.info(rolePermissions);

  if (rolePermissions.length) {
    await knex('rolePermissions')
      .insert(rolePermissions);
  }
};

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
    log.warn('role not found');

    throw httpErrors.notFound();
  }

  await Promise.all([
    updateName(id, name, { knex }),
    updatePermissions(id, permissionIds, { log, knex }),
  ]);
};
