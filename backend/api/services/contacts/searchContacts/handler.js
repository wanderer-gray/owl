module.exports = async function operation({ userId, query }, { log, knex }) {
  log.trace('searchContacts');
  log.debug(userId);
  log.debug(query);

  const {
    email,
    limit,
  } = query;

  const [
    contacts,
    count,
  ] = await Promise.all([
    knex('contacts')
      .join('users', 'users.id', '=', knex.raw('userIdFrom + userIdTo - ?', [userId]))
      .where((builder) => {
        builder
          .where({ userIdFrom: userId })
          .orWhere({ userIdTo: userId });
      })
      .where('email', 'ilike', `${email}%`)
      .select(knex.ref('contacts.id').as('id'), 'email')
      .orderBy('email')
      .limit(limit),
    knex('contacts')
      .join('users', 'users.id', '=', knex.raw('userIdFrom + userIdTo - ?', [userId]))
      .where((builder) => {
        builder
          .where({ userIdFrom: userId })
          .orWhere({ userIdTo: userId });
      })
      .where('email', 'ilike', `${email}%`)
      .select(knex.raw('count(*)::int')),
  ]);

  return {
    result: contacts,
    count,
  };
};
