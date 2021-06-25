module.exports = async function operation({ userId, query }, { log, knex }) {
  log.trace('deleteContact');
  log.debug(userId);
  log.debug(query);

  const { id } = query;

  await knex('contacts')
    .where({ id })
    .where((builder) => {
      builder
        .where({ userIdFrom: userId })
        .orWhere({ userIdTo: userId });
    })
    .del();
};
