module.exports = async function operation({ userId }, { log, knex }) {
  log.trace('updateLink');
  log.debug(userId);

  await knex('users')
    .where({ id: userId })
    .update('link', knex.raw('gen_random_uuid()'));
};
