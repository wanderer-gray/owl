const {
  objects: { SYSTEM },
  actions: { DELETE },
} = require('../../../enums');
const { getCheckPermissions } = require('../../../utils');

module.exports = async function operation({ userId, query }, { log, knex, httpErrors }) {
  log.trace('deleteEmailCondition');
  log.debug(userId);
  log.debug(query);

  const checkPermissions = await getCheckPermissions(userId, { log, knex });

  if (!checkPermissions(SYSTEM, DELETE)) {
    log.warn('no permission to delete a system config');

    throw httpErrors.forbidden();
  }

  const { id } = query;

  const numberDeletedConditions = await knex('emailСonditions')
    .where({ id })
    .del();

  if (!numberDeletedConditions) {
    log.warn('condition not found');

    throw httpErrors.notFound();
  }
};
