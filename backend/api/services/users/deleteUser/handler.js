const {
  objects: { USERS },
  actions: { DELETE },
} = require('../../../enums');
const { getCheckPermissions } = require('../../../utils');

module.exports = async function operation({ userId, query }, { log, knex, httpErrors }) {
  log.trace('deleteUser');
  log.debug(userId);
  log.debug(query);

  const { id } = query;

  const checkPermissions = await getCheckPermissions(userId, { log, knex });

  if (!checkPermissions(USERS, DELETE)) {
    log.warn('no permission to delete a user');

    throw httpErrors.forbidden();
  }

  await knex('users')
    .where({ id })
    .del();
};
