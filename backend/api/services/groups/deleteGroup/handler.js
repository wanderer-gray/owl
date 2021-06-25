module.exports = async function operation({ userId, query }, { log, knex }) {
  log.trace('deleteGroup');
  log.debug(userId);
  log.debug(query);

  const { id } = query;

  await knex('groups')
    .where({
      id,
      ownerId: userId,
    })
    .del();
};
