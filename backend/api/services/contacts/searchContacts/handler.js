module.exports = async function operation({ userId, query, body }, { log, knex }) {
  log.trace('searchContacts');
  log.debug(userId);
  log.debug(query);
  log.debug(body);

  const {
    email,
    limit,
  } = query;
  const { noContactIds } = body;

  const [
    contacts,
    [{ count }],
  ] = await Promise.all([
    knex('contacts')
      .join('users', 'users.id', '=', knex.raw('"userIdFrom" + "userIdTo" - ?', [userId]))
      .where((builder) => {
        builder
          .where({ userIdFrom: userId })
          .orWhere({ userIdTo: userId });
      })
      .where('email', 'ilike', `${email}%`)
      .whereNotIn(knex.ref('contacts.id'), noContactIds)
      .select(knex.ref('contacts.id').as('id'), 'email')
      .orderBy('email')
      .limit(limit),
    knex('contacts')
      .join('users', 'users.id', '=', knex.raw('"userIdFrom" + "userIdTo" - ?', [userId]))
      .where((builder) => {
        builder
          .where({ userIdFrom: userId })
          .orWhere({ userIdTo: userId });
      })
      .where('email', 'ilike', `${email}%`)
      .whereNotIn(knex.ref('contacts.id'), noContactIds)
      .select(knex.raw('count(*)::int')),
  ]);

  return {
    contacts,
    count,
  };
};
