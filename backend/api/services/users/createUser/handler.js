const {
  pass: {
    getSalt,
    getHash,
  },
} = require('../../auth/utils');

module.exports = async function operation({ userId, body }, { log, knex }) {
  log.trace('createUser');
  log.debug(userId);
  log.debug(body);

  const {
    email,
    password,
    roleIds,
  } = body;

  const salt = getSalt();
  log.info(salt);
  const hash = await getHash(password, salt);
  log.info(hash);

  const [newUserId] = await knex('users')
    .insert({
      email,
      salt,
      hash,
    })
    .returning('id');

  log.info(newUserId);

  const userRoles = roleIds.map((roleId) => ({
    userId: newUserId,
    roleId,
  }));

  log.info(userRoles);

  if (userRoles.length) {
    await knex('userRoles')
      .insert(userRoles);
  }
};
