module.exports = async function operation({ userId, query }, { log, knex }) {
  log.trace('deleteRole');
  log.debug(userId);
  log.debug(query);

  const { id } = query;

  await knex('roles')
    .where({ id })
    .del();
};
