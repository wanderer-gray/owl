const { tests: { types } } = require('../../../enums');
const { knexExists } = require('../../../utils');
const { checkSign } = require('../utils');

module.exports = async function operation({ query, body }, { log, knex, httpErrors }) {
  log.trace('getResult');
  log.debug(query);
  log.debug(body);

  const {
    testId,
    userId,
  } = query;

  const check = await checkSign(query);

  if (!check) {
    log.warn('no permission to get a result');

    throw httpErrors.forbidden();
  }

  const queryNotReadyTest = knex('testUsers')
    .where({
      id: userId,
      testId,
      ready: false,
    });

  const existsNotReadyTest = await knexExists(queryNotReadyTest, knex);

  if (!existsNotReadyTest) {
    log.warn('no permission to get a result (test ready)');

    throw httpErrors.forbidden();
  }

  await knex('testUsers')
    .where({
      id: userId,
      testId,
    })
    .update({ ready: true });

  const countCheckedOptions = knex('options')
    .join('testUserAnswers', 'options.id', '=', 'testUserAnswers.optionId')
    .whereRaw('"questions"."id" = "options"."questionId"')
    .where({ userId })
    .select(knex.raw('sum(case when checked then 1 else -1 end)'));
  const countAllOptions = knex('options')
    .whereRaw('"questions"."id" = "options"."questionId"')
    .where({ checked: true })
    .count('*');

  const [{ sum: points }] = await knex('questions')
    .where({ testId })
    .select(knex.raw('sum(points * greatest(? / ?, 0))', [
      countCheckedOptions,
      countAllOptions,
    ]));

  const queryCheckTypeTest = knex('tests')
    .where({
      testId,
      type: types.TEST,
    });

  const [
    [{ sum: testPoints }],
    decisions,
  ] = await Promise.all([
    knex('questions')
      .where({ testId })
      .sum('points'),
    knex('decisions')
      .where({ testId })
      .select([
        'title',
        'description',
      ])
      .where('from', '<=', points)
      .where('to', '>=', points)
      .whereExists(queryCheckTypeTest),
  ]);

  return {
    points,
    decisions,
    testPoints,
  };
};
