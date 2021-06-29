const { members: { roles: { CREATOR } } } = require('../../../enums');
const { knexExists } = require('../../../utils');

module.exports = async function operation({ userId, query }, { log, knex, httpErrors }) {
  log.trace('getDecisions');
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

  const userAllowGetDecisions = await knexExists(checkUserPermissions, knex);

  if (!userAllowGetDecisions) {
    log.warn('no permission to select a decisions');

    throw httpErrors.forbidden();
  }

  const decisions = await knex('decisions')
    .where({ testId })
    .select([
      'title',
      'description',
      'from',
      'to',
    ])
    .orderBy('title');

  return decisions;
};
