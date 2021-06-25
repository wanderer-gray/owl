module.exports = async function operation({ userId, query }, { log, knex }) {
  log.trace('getEmailConditions');
  log.debug(userId);
  log.debug(query);

  const { action } = query;

  const conditions = await knex('emailСonditions')
    .where({ action })
    .select('*')
    .orderBy([
      'type',
      'id',
    ]);

  log.info(conditions);

  return conditions;
};
