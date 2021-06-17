const {
  objects: { USERS },
  actions: { UPDATE },
} = require('../../../enums');
const { getCheckPermissions } = require('../../../utils');

module.exports = async function operation({ userId, query, body }, { log, knex, httpErrors }) {
  log.trace('updateUser');
  log.debug(userId);
  log.debug(query);
  log.debug(body);

  const { id } = query;
  const { roleIds } = body;

  const checkPermissions = await getCheckPermissions(userId, { log, knex });

  if (!checkPermissions(USERS, UPDATE)) {
    log.warn('no permission to update a user');

    throw httpErrors.forbidden();
  }

  await knex('userRoles')
    .where({ userId: id })
    .del();

  const userRoles = roleIds.map((roleId) => ({
    userId: id,
    roleId,
  }));

  log.info(userRoles);

  if (userRoles.length) {
    await knex('userRoles')
      .insert(userRoles);
  }
};
