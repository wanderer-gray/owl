const {
  permissions: {
    objects: { ROLES },
    actions: { DELETE },
  },
} = require('../../../enums');
const { getCheckPermissions } = require('../../../utils');

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

  const numberDeletedRoles = await knex('roles')
    .where({ id })
    .del();

  log.info(numberDeletedRoles);

  if (!numberDeletedRoles) {
    log.warn('role not found');

    throw httpErrors.notFound();
  }
};
