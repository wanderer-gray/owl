const fmtGroup = async (group, { userId, knex }) => {
  const contacts = await knex('contacts')
    .join('groupContacts', 'contacts.id', '=', 'groupContacts.contactId')
    .join('users', 'users.id', '=', knex.raw('"userIdFrom" + "userIdTo" - ?', [userId]))
    .where('groupId', group.id)
    .select(knex.ref('contacts.id').as('id'), 'email');

  return {
    ...group,
    contacts,
  };
};

const fmtResult = async (groups, count, { userId, knex }) => {
  const result = await Promise.all(groups.map((group) => fmtGroup(group, { userId, knex })));

  return {
    groups: result,
    count,
  };
};

module.exports = async function operation({ userId, query, body }, { log, knex }) {
  log.trace('searchGroups');
  log.debug(userId);
  log.debug(query);
  log.debug(body);

  const {
    title,
    limit,
  } = query;
  const { noGroupIds } = body;

  const [
    groups,
    [{ count }],
  ] = await Promise.all([
    knex('groups')
      .where('title', 'ilike', `${title}%`)
      .where('ownerId', userId)
      .whereNotIn('id', noGroupIds)
      .select('id', 'title')
      .orderBy('title')
      .limit(limit),
    knex('groups')
      .where('title', 'ilike', `${title}%`)
      .where('ownerId', userId)
      .whereNotIn('id', noGroupIds)
      .select(knex.raw('count(*)::int')),
  ]);

  const result = await fmtResult(groups, count, { userId, knex });

  return result;
};
