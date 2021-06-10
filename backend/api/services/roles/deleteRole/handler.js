const {
  objects: { ROLES },
  actions: { DELETE },
} = require('../../../enums');
const {
  getCheckPermissions,
  knexExists,
} = require('../../../utils');

module.exports = async function operation({ userId, query }, { log, knex, httpErrors }) {
  log.trace('deleteRole');
  log.debug(userId);
  log.debug(query);

  const { id } = query;

  const checkPermissions = await getCheckPermissions(userId, { log, knex });

  if (!checkPermissions(ROLES, DELETE)) {
    log.warn('no permission to delete a role');

    throw httpErrors.forbidden();
  }

  const queryFindRole = knex('roles')
    .where({ id });

  const existsRole = await knexExists(queryFindRole, knex);

  if (!existsRole) {
    log.warn('role is not exists');

    throw httpErrors.notFound();
  }

  await knex('roles')
    .where({ id })
    .del();
};
