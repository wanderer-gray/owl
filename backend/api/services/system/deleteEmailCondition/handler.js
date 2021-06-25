module.exports = async function operation({ userId, query }, { log, knex }) {
  log.trace('deleteEmailCondition');
  log.debug(userId);
  log.debug(query);

  const { id } = query;

  await knex('emailСonditions')
    .where({ id })
    .del();
};
