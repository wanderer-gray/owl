const {
  permissions: {
    objects: { SYSTEM },
    actions: { UPDATE },
  },
} = require('../../../enums');
const { getCheckPermissions } = require('../../../utils');

module.exports = async function operation({ userId, query, body }, { log, knex, httpErrors }) {
  log.trace('updateGlobalPermission');
  log.debug(userId);
  log.debug(query);
  log.debug(body);

  const { id } = query;
  const { permit } = body;

  const checkPermissions = await getCheckPermissions(userId, { log, knex });

  if (!checkPermissions(SYSTEM, UPDATE)) {
    log.warn('no permission to update a system config');

    throw httpErrors.forbidden();
  }

  const numberUpdatedGlobalPermissions = await knex('globalPermissions')
    .where({ id })
    .update({ permit });

  if (!numberUpdatedGlobalPermissions) {
    log.warn('global permission not found');

    throw httpErrors.notFound();
  }
};
