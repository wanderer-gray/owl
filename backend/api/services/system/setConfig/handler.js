const {
  objects: { SYSTEM },
  actions: { UPDATE },
} = require('../../../enums');
const { getCheckPermissions } = require('../../../utils');

module.exports = async function operation({ userId, body }, { log, knex, httpErrors }) {
  log.trace('setConfig');
  log.debug(userId);
  log.debug(body);

  const checkPermissions = await getCheckPermissions(userId, { log, knex });

  if (!checkPermissions(SYSTEM, UPDATE)) {
    log.warn('no permission to update a system config');

    throw httpErrors.forbidden();
  }

  await knex('system')
    .update(body)
    .onConflict('key')
    .merge();
};
