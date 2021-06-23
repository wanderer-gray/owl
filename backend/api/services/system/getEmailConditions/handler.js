const {
  permissions: {
    objects: { SYSTEM },
    actions: { SELECT },
  },
} = require('../../../enums');
const { getCheckPermissions } = require('../../../utils');

module.exports = async function operation({ userId, query }, { log, knex, httpErrors }) {
  log.trace('getEmailConditions');
  log.debug(userId);
  log.debug(query);

  const { action } = query;

  const checkPermissions = await getCheckPermissions(userId, { log, knex });

  if (!checkPermissions(SYSTEM, SELECT)) {
    log.warn('no permission to select a system config');

    throw httpErrors.forbidden();
  }

  const conditions = await knex('emailСonditions')
    .where({ action })
    .select('*')
    .orderBy([
      'type',
      'id',
    ]);

  log.info(conditions);

  return conditions;
};
