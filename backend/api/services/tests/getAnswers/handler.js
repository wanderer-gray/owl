const { knexArrayAgg } = require('../../../utils');

module.exports = async function operation({ userId, query }, { log, knex }) {
  log.trace('getAnswers');
  log.debug(userId);
  log.debug(query);

  const {
    id,
    offset,
  } = query;

  const countCheckedOptions = knex('options')
    .join('testUserAnswers', 'options.id', '=', 'testUserAnswers.optionId')
    .whereRaw('"questions"."id" = "options"."questionId"')
    .whereRaw('"testUsers"."id" = "testUserAnswers"."userId"')
    .select(knex.raw('sum(case when checked then 1 else -1 end)'));
  const countAllOptions = knex('options')
    .whereRaw('"questions"."id" = "options"."questionId"')
    .where({ checked: true })
    .count('*');

  const points = knex('questions')
    .where({ testId: id })
    .select(knex.raw('sum(points * greatest(? / greatest(?, 1), 0))::float', [
      countCheckedOptions,
      countAllOptions,
    ]));

  const maxPoints = knex('questions')
    .where({ testId: id })
    .select(knex.raw('sum(points)::int'));

  const options = knex('options')
    .join('testUserAnswers', 'options.id', '=', 'testUserAnswers.optionId')
    .whereRaw('"questions"."id" = "options"."questionId"')
    .whereRaw('"testUsers"."id" = "testUserAnswers"."userId"')
    .select([
      knex.ref('options.id').as('id'),
      'title',
    ]);

  const questions = knex('questions')
    .where({ testId: id })
    .select([
      'id',
      'title',
      knexArrayAgg(options, knex).as('options'),
    ]);

  const decisions = knex('decisions')
    .where({ testId: id })
    .where('from', '<=', points)
    .where('to', '>=', points)
    .select([
      'title',
      'description',
    ]);

  const [
    [info],
    [{ count }],
  ] = await Promise.all([
    knex('testUsers')
      .where({
        testId: id,
        userId,
      })
      .select([
        'id',
        points.clone().as('points'),
        maxPoints.as('maxPoints'),
        knexArrayAgg(questions, knex).as('questions'),
        knexArrayAgg(decisions, knex).as('decisions'),
      ])
      .offset(offset)
      .limit(1),
    knex('testUsers')
      .where({
        testId: id,
        userId,
      })
      .select(knex.raw('count(*)::int')),
  ]);

  return {
    info,
    count,
  };
};
