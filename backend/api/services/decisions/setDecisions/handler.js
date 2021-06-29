const { members: { roles: { CREATOR } } } = require('../../../enums');
const { knexExists } = require('../../../utils');

module.exports = async function operation({ userId, query, body }, { log, knex, httpErrors }) {
  log.trace('setDecisions');
  log.debug(userId);
  log.debug(query);
  log.debug(body);

  const { testId } = query;
  const { decisions } = body;

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

  const userAllowSetDecisions = await knexExists(checkUserPermissions, knex);

  if (!userAllowSetDecisions) {
    log.warn('no permission to set a decisions');

    throw httpErrors.forbidden();
  }

  await knex('decisions')
    .where({ testId })
    .del();

  const [{ sum: points }] = await knex('questions')
    .where({ testId })
    .select(knex.raw('sum(points)::int'));

  const dbDecisions = decisions.map((decision) => {
    const {
      title,
      description,
      from,
      to,
    } = decision;

    return {
      testId,
      title,
      description,
      from: Math.min(from, to, points),
      to: Math.min(Math.max(from, to), points),
    };
  });

  if (!dbDecisions.length) {
    return;
  }

  await knex('decisions')
    .insert(dbDecisions);
};
