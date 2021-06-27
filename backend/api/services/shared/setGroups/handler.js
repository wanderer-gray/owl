const { members: { roles: { CREATOR } } } = require('../../../enums');
const { knexExists } = require('../../../utils');

module.exports = async function operation({ userId, query, body }, { log, knex, httpErrors }) {
  log.trace('setGroups');
  log.debug(userId);
  log.debug(query);
  log.debug(body);

  const { testId } = query;
  const { groups } = body;

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

  const groupIds = groups.map(({ id }) => id);

  const checkUserBadGroups = knex('groups')
    .whereIn('id', groupIds)
    .whereNot({ ownerId: userId });

  const existsBadGroup = await knexExists(checkUserBadGroups, knex);

  if (existsBadGroup) {
    log.warn('no exists group');

    throw httpErrors.forbidden();
  }

  await knex('testGroups')
    .where({ testId })
    .del();

  const testGroups = groups.map((group) => {
    const {
      id: groupId,
      begin,
      end,
      limit,
    } = group;

    return {
      testId,
      groupId,
      begin,
      end,
      limit,
    };
  });

  if (!testGroups.length) {
    return;
  }

  await knex('testGroups')
    .insert(testGroups);
};
