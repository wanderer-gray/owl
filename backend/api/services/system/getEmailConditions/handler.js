const {
  objects: { SYSTEM },
  actions: { SELECT },
} = require('../../../enums');
const { getCheckPermissions } = require('../../../utils');

module.exports = async function operation({ userId }, { log, knex, httpErrors }) {
  log.trace('getEmailConditions');
  log.debug(userId);

  const checkPermissions = await getCheckPermissions(userId, { log, knex });

  if (!checkPermissions(SYSTEM, SELECT)) {
    log.warn('no permission to select a system config');

    throw httpErrors.forbidden();
  }

  const conditions = await knex('emailСonditions')
    .select('*');

  log.info(conditions);

  return conditions;
};
