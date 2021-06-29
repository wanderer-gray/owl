const { questions: { types } } = require('../../../enums');
const {
  getDateISO,
  knexExists,
} = require('../../../utils');
const { checkSign } = require('../utils');

module.exports = async function operation({ query, body }, { log, knex, httpErrors }) {
  log.trace('setAnswer');
  log.debug(query);
  log.debug(body);

  const {
    testId,
    userId,
    end,
  } = query;
  const {
    optionId,
    value,
  } = body;

  if (new Date(end) < getDateISO()) {
    log.warn('no permission to set a answer (end time)');

    throw httpErrors.forbidden();
  }

  const check = await checkSign(query);

  if (!check) {
    log.warn('no permission to set a answer');

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
    log.warn('no permission to set a answer (test ready)');

    throw httpErrors.forbidden();
  }

  const queryExistsOptionInTest = knex('tests')
    .join('questions', 'tests.id', '=', 'questions.testId')
    .join('options', 'questions.id', '=', 'options.questionId')
    .where(knex.ref('tests.id'), testId)
    .where(knex.ref('options.id'), optionId);

  const existsOptionInTest = await knexExists(queryExistsOptionInTest, knex);

  if (!existsOptionInTest) {
    log.warn('option not found');

    throw httpErrors.notFound();
  }

  const queryQuestionId = knex('options')
    .where({ id: optionId })
    .select('questionId');
  const queryOptionIds = knex('questions')
    .join('options', 'questions.id', '=', 'options.questionId')
    .where(knex.ref('questions.id'), queryQuestionId)
    .where({ type: types.RADIO_BUTS })
    .select(knex.ref('options.id'));

  await knex('testUserAnswers')
    .where({ userId })
    .whereIn('optionId', queryOptionIds)
    .del();

  if (value) {
    await knex('testUserAnswers')
      .insert({
        userId,
        optionId,
      })
      .onConflict(['userId', 'optionId'])
      .ignore();
  } else {
    await knex('testUserAnswers')
      .where({
        userId,
        optionId,
      })
      .del();
  }
};
