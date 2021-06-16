const {
  objects: { SYSTEM },
  actions: { CREATE },
} = require('../../../enums');
const { getCheckPermissions } = require('../../../utils');

module.exports = async function operation({ userId, body }, { log, knex, httpErrors }) {
  log.trace('createEmailCondition');
  log.debug(userId);
  log.debug(body);

  const checkPermissions = await getCheckPermissions(userId, { log, knex });

  if (!checkPermissions(SYSTEM, CREATE)) {
    log.warn('no permission to create a system config');

    throw httpErrors.forbidden();
  }

  await knex('emailСonditions')
    .insert(body);
};
