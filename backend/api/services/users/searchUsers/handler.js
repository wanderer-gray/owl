const {
  objects: { USERS },
  actions: { SELECT },
} = require('../../../enums');
const { getCheckPermissions } = require('../../../utils');

const fmtUser = async (user, { knex }) => {
  const roleIds = await knex('userRoles')
    .where('userId', user.id)
    .pluck('roleId');

  return {
    ...user,
    roleIds,
  };
};

const fmtResult = async (users, count, { knex }) => {
  const result = await Promise.all(users.map((user) => fmtUser(user, { knex })));

  return {
    user: result,
    count,
  };
};

module.exports = async function operation({ userId, query }, { log, knex, httpErrors }) {
  log.trace('searchUsers');
  log.debug(userId);
  log.debug(query);

  const checkPermissions = await getCheckPermissions(userId, { log, knex });

  if (!checkPermissions(USERS, SELECT)) {
    log.warn('no permission to select a users');

    throw httpErrors.forbidden();
  }

  const {
    email,
    limit,
  } = query;

  const [
    users,
    [{ count }],
  ] = await Promise.all([
    knex('users')
      .where('email', 'ilike', `${email}%`)
      .select('id', 'email')
      .orderBy('email')
      .limit(limit),
    knex('users')
      .where('email', 'ilike', `${email}%`)
      .select(knex.raw('count(*)::int')),
  ]);

  const result = await fmtResult(users, count, { knex });

  log.debug(result);

  return result;
};
