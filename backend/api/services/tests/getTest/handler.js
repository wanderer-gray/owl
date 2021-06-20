const { tests: { members: { CREATOR } } } = require('../../../enums');
const { knexExists } = require('../../../utils');

module.exports = async function operation({ userId, query }, { log, knex, httpErrors }) {
  log.trace('getTest');
  log.debug(userId);
  log.debug(query);

  const { id } = query;

  const queryFindTest = knex('tests')
    .where({ id });

  const existsTest = await knexExists(queryFindTest, knex);

  if (!existsTest) {
    log.warn('test not found');

    throw httpErrors.notFound();
  }

  const queryFindUserTest = knex('testMembers')
    .where({
      testId: id,
      userId,
      roleEnum: CREATOR,
    });

  const existsUserTest = await knexExists(queryFindUserTest, knex);

  if (!existsUserTest) {
    log.warn('no permission to update a test');

    throw httpErrors.forbidden();
  }
};
