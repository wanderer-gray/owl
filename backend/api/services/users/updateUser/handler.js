module.exports = async function operation({ userId, query, body }, { log, knex }) {
  log.trace('updateUser');
  log.debug(userId);
  log.debug(query);
  log.debug(body);

  const { id } = query;
  const { roleIds } = body;

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
