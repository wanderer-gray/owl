module.exports = async function operation({ userId, query, body }, { log, knex, httpErrors }) {
  log.trace('updateGlobalPermission');
  log.debug(userId);
  log.debug(query);
  log.debug(body);

  const { id } = query;
  const { permit } = body;

  const numberUpdatedGlobalPermissions = await knex('permissions')
    .where({
      id,
      global: true,
    })
    .update({ permit });

  if (!numberUpdatedGlobalPermissions) {
    log.warn('global permission not found');

    throw httpErrors.notFound();
  }
};
