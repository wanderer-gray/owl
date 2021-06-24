const {
  permissions: {
    objects: { SYSTEM },
    actions: { SELECT },
  },
} = require('../../../enums');
const { getCheckPermissions } = require('../../../utils');

module.exports = async function operation({ userId }, { log, knex, httpErrors }) {
  log.trace('getGlobalPermissions');
  log.debug(userId);

  const checkPermissions = await getCheckPermissions(userId, { log, knex });

  if (!checkPermissions(SYSTEM, SELECT)) {
    log.warn('no permission to select a system config');

    throw httpErrors.forbidden();
  }

  const globalPermissions = await knex('globalPermissions')
    .select('*')
    .orderBy([
      'object',
      'action',
    ]);

  log.info(globalPermissions);

  return globalPermissions;
};
