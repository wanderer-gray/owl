const { members: { roles: { CREATOR } } } = require('../../../enums');
const {
  knexExists,
  knexArrayAgg,
} = require('../../../utils');

module.exports = async function operation({ userId, query }, { log, knex, httpErrors }) {
  log.trace('getAnalytics');
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

  const rateUser = knex('options')
    .join('testUserAnswers', 'options.id', '=', 'testUserAnswers.optionId')
    .whereRaw('"questions"."id" = "options"."questionId"')
    .whereRaw('"testUsers"."id" = "testUserAnswers"."userId"')
    .select(knex.raw('sum(case when checked then 1 else -1 end)'));

  const rateQuestion = knex('options')
    .whereRaw('"questions"."id" = "options"."questionId"')
    .where({ checked: true })
    .count('*');

  const points = knex('questions')
    .whereRaw('"testUsers"."testId" = "questions"."testId"')
    .select(knex.raw('sum(points * greatest(? / ?, 0))', [
      rateUser,
      rateQuestion,
    ]));

  const countOptionAnswers = knex('testUserAnswers')
    .whereRaw('"options"."id" = "testUserAnswers"."optionId"')
    .count('*');

  const rateOptions = knex('options')
    .whereRaw('"questions"."id" = "options"."questionId"')
    .select([
      'id',
      countOptionAnswers.as('count'),
    ]);

  const [
    maxPoints,
    countPoints,
    rateQuestions,
  ] = await Promise.all([
    knex('questions')
      .where({ testId: id })
      .sum('points'),
    knex('testUsers')
      .where({ testId: id })
      .select([
        knex.raw('count(*)').as('count'),
        points.as('points'),
      ])
      .groupBy('points')
      .orderBy('count'),
    knex('questions')
      .where({ testId: id })
      .select([
        'id',
        knexArrayAgg(rateOptions).as('options'),
      ]),
  ]);

  return {
    maxPoints,
    countPoints,
    rateQuestions,
  };
};
