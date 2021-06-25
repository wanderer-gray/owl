module.exports = async function operation({ userId, query }, { log, knex }) {
  log.trace('deleteUser');
  log.debug(userId);
  log.debug(query);

  const { id } = query;

  await knex('users')
    .where({ id })
    .del();
};
