module.exports = async function operation({ userId, body }, { log, knex }) {
  log.trace('createEmailCondition');
  log.debug(userId);
  log.debug(body);

  const {
    type,
    action,
    condition,
  } = body;

  await knex('emailСonditions')
    .insert({
      type,
      action,
      condition,
    });
};
