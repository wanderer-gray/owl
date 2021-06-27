const { members: { roles: { CREATOR } } } = require('../../../enums');
const {
  knexExists,
  knexArrayAgg,
} = require('../../../utils');

module.exports = async function operation({ userId, query }, { log, knex, httpErrors }) {
  log.trace('getShared');
  log.debug(userId);
  log.debug(query);

  const { testId } = query;

  const queryFindTest = knex('tests')
    .where({ id: testId });

  const existsTest = await knexExists(queryFindTest, knex);

  if (!existsTest) {
    log.warn('test not found');

    throw httpErrors.notFound();
  }

  const checkUserPermissions = knex('members')
    .where({
      testId,
      userId,
      role: CREATOR,
    });

  const userAllowGetShared = await knexExists(checkUserPermissions, knex);

  if (!userAllowGetShared) {
    log.warn('no permission to select a shared');

    throw httpErrors.forbidden();
  }

  const contacts = knex('contacts')
    .join('testContacts', 'contacts.id', '=', 'testContacts.contactId')
    .join('users', knex.raw('"userIdFrom" + "userIdTo" - ?', [userId]), '=', 'users.id')
    .where({ testId })
    .select([
      knex.ref('contacts.id').as('id'),
      'email',
      'begin',
      'end',
      'limit',
    ]);

  const groups = knex('groups')
    .join('testGroups', 'groups.id', '=', 'testGroups.groupId')
    .where({ testId })
    .select([
      knex.ref('groups.id').as('id'),
      'title',
      'begin',
      'end',
      'limit',
    ]);

  const result = await knex('tests')
    .where({ id: testId })
    .first([
      'availableAll',
      knexArrayAgg(contacts, knex).as('contacts'),
      knexArrayAgg(groups, knex).as('groups'),
    ]);

  return result;
};
