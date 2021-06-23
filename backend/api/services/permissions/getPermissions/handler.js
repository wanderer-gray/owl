const {
  permissions: {
    objects: { PERMISSIONS },
    actions: { SELECT },
  },
} = require('../../../enums');
const { getCheckPermissions } = require('../../../utils');

module.exports = async function operation({ userId }, { log, knex, httpErrors }) {
  log.trace('getPermissions');
  log.debug(userId);

  const checkPermissions = await getCheckPermissions(userId, { log, knex });

  if (!checkPermissions(PERMISSIONS, SELECT)) {
    log.warn('no permission to select a permissions');

    throw httpErrors.forbidden();
  }

  const permissions = await knex('permissions')
    .select('*');

  return permissions;
};
