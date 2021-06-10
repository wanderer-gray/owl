const getProfile = async (userId, { knex }) => {
  const profile = await knex('accounts')
    .where({ authId: userId })
    .first('profile');

  return profile || {};
};

module.exports = async function operation({ userId }, { log, knex }) {
  log.trace('getProfile');
  log.debug(userId);

  const [
    profile,
    email,
  ] = await Promise.all([
    getProfile(userId, { knex }),
    knex('auths')
      .where({ id: userId })
      .first('email'),
  ]);

  log.debug(email);
  log.debug(profile);

  return {
    ...profile,
    email,
  };
};
