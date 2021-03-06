const fmtUser = async (user, { knex }) => {
  const roles = await knex('userRoles')
    .join('roles', 'roles.id', '=', 'userRoles.roleId')
    .where('userId', user.id)
    .select(knex.ref('roles.id').as('id'), knex.ref('roles.name').as('name'));

  return {
    ...user,
    roles,
  };
};

const fmtResult = async (users, count, { knex }) => {
  const result = await Promise.all(users.map((user) => fmtUser(user, { knex })));

  return {
    users: result,
    count,
  };
};

module.exports = async function operation({ userId, query }, { log, knex }) {
  log.trace('searchUsers');
  log.debug(userId);
  log.debug(query);

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
