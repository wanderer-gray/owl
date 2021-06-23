const {
  permissions: {
    objects: { GROUPS },
    actions: { DELETE },
  },
} = require('../../../enums');
const { getCheckGlobalPermissions } = require('../../../utils');

module.exports = async function operation({ userId, query }, { log, knex, httpErrors }) {
  log.trace('deleteGroup');
  log.debug(userId);
  log.debug(query);

  const { id } = query;

  const checkGlobalPermissions = await getCheckGlobalPermissions({ log, knex });

  if (!checkGlobalPermissions(GROUPS, DELETE)) {
    log.warn('not allow to delete group');

    throw httpErrors.locked();
  }

  const numberDeletedGroups = await knex('groups')
    .where({
      id,
      ownerId: userId,
    })
    .del();

  log.info(numberDeletedGroups);

  if (!numberDeletedGroups) {
    log.warn('group not found');

    throw httpErrors.notFound();
  }
};
