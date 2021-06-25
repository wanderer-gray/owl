module.exports = async function operation({ userId, query, body }, { log, knex, httpErrors }) {
  log.trace('updateEmailCondition');
  log.debug(userId);
  log.debug(query);
  log.debug(body);

  const { id } = query;
  const {
    type,
    action,
    condition,
  } = body;

  const numberUpdatedConditions = await knex('emailСonditions')
    .where({ id })
    .update({
      type,
      action,
      condition,
    });

  if (!numberUpdatedConditions) {
    log.warn('condition not found');

    throw httpErrors.notFound();
  }
};
