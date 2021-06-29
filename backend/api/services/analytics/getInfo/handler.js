const { members: { roles: { CREATOR } } } = require('../../../enums');
const {
  knexExists,
  knexArrayAgg,
} = require('../../../utils');

module.exports = async function operation({ userId, query }, { log, knex, httpErrors }) {
  log.trace('getInfo');
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

  const checkUserPermissions = knex('members')
    .where({
      testId: id,
      userId,
      role: CREATOR,
    });

  const userAllowUpdateTest = await knexExists(checkUserPermissions, knex);

  if (!userAllowUpdateTest) {
    log.warn('no permission to select a test');

    throw httpErrors.forbidden();
  }

  const options = knex('options')
    .whereRaw('"questions"."id" = "options"."questionId"')
    .select([
      'id',
      'checked',
      'title',
    ])
    .orderBy('weight');

  const questions = await knex('questions')
    .where({ testId: id })
    .select([
      'id',
      'title',
      'points',
      knexArrayAgg(options, knex).as('options'),
    ])
    .orderBy('weight');

  return questions;
};
