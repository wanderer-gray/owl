module.exports = async function operation({ userId, query }, { log, knex, httpErrors }) {
  log.trace('deleteGroup');
  log.debug(userId);
  log.debug(query);

  const { id } = query;

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
