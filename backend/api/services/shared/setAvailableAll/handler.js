const { members: { roles: { CREATOR } } } = require('../../../enums');
const { knexExists } = require('../../../utils');

module.exports = async function operation({ userId, query, body }, { log, knex, httpErrors }) {
  log.trace('setAvailableAll');
  log.debug(userId);
  log.debug(query);
  log.debug(body);

  const { testId } = query;
  const { availableAll } = body;

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
    log.warn('no permission to update a test');

    throw httpErrors.forbidden();
  }

  await knex('tests')
    .where({ id: testId })
    .update({ availableAll });
};
