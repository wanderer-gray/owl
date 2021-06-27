const { members: { roles: { CREATOR } } } = require('../../../enums');
const { knexExists } = require('../../../utils');

module.exports = async function operation({ userId, query, body }, { log, knex, httpErrors }) {
  log.trace('setContacts');
  log.debug(userId);
  log.debug(query);
  log.debug(body);

  const { testId } = query;
  const { contacts } = body;

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

  const userAllowCreateLink = await knexExists(checkUserPermissions, knex);

  if (!userAllowCreateLink) {
    log.warn('no permission to update a test contacts');

    throw httpErrors.forbidden();
  }

  const contactIds = contacts.map(({ id }) => id);

  const checkUserBadContacts = knex('contacts')
    .whereIn('id', contactIds)
    .whereNot({ userIdFrom: userId })
    .whereNot({ userIdTo: userId });

  const existsBadContact = await knexExists(checkUserBadContacts, knex);

  if (existsBadContact) {
    log.warn('no exists contact');

    throw httpErrors.forbidden();
  }

  await knex('testContacts')
    .where({ testId })
    .del();

  const testContacts = contacts.map((contact) => {
    const {
      id: contactId,
      begin,
      end,
      limit,
    } = contact;

    return {
      testId,
      contactId,
      begin,
      end,
      limit,
    };
  });

  if (!testContacts.length) {
    return;
  }

  await knex('testContacts')
    .insert(testContacts);
};
