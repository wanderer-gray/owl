module.exports = async function operation({ userId }, { log, knex }) {
  log.trace('getProfile');
  log.debug(userId);

  const profile = await knex('users')
    .where({ id: userId })
    .first([
      'id',
      'email',
      'link',
    ]);

  return profile;
};
