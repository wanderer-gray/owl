const {
  permissions: {
    objects: { GROUPS },
    actions: { SELECT },
  },
} = require('../../../enums');
const { getCheckGlobalPermissions } = require('../../../utils');

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

module.exports = async function operation({ userId, query }, { log, knex, httpErrors }) {
  log.trace('searchGroups');
  log.debug(userId);
  log.debug(query);

  const {
    title,
    limit,
  } = query;

  const checkGlobalPermissions = await getCheckGlobalPermissions({ log, knex });

  if (!checkGlobalPermissions(GROUPS, SELECT)) {
    log.warn('not allow to select group');

    throw httpErrors.locked();
  }

  const [
    groups,
    [{ count }],
  ] = await Promise.all([
    knex('groups')
      .where('title', 'ilike', `${title}%`)
      .select('id', 'title')
      .where('ownerId', userId)
      .orderBy('title')
      .limit(limit),
    knex('groups')
      .where('title', 'ilike', `${title}%`)
      .where('ownerId', userId)
      .select(knex.raw('count(*)::int')),
  ]);

  const result = await fmtResult(groups, count, { userId, knex });

  return result;
};
