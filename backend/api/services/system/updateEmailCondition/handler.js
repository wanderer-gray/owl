const {
  objects: { SYSTEM },
  actions: { UPDATE },
} = require('../../../enums');
const { getCheckPermissions } = require('../../../utils');

module.exports = async function operation({ userId, query, body }, { log, knex, httpErrors }) {
  log.trace('updateEmailCondition');
  log.debug(userId);
  log.debug(query);
  log.debug(body);

  const checkPermissions = await getCheckPermissions(userId, { log, knex });

  if (!checkPermissions(SYSTEM, UPDATE)) {
    log.warn('no permission to update a system config');

    throw httpErrors.forbidden();
  }

  const { id } = query;

  const numberUpdatedConditions = await knex('emailСonditions')
    .where({ id })
    .update(body);

  if (!numberUpdatedConditions) {
    log.warn('condition not found');

    throw httpErrors.notFound();
  }
};
