const {
  tests: {
    types,
    members: { CREATOR },
  },
} = require('../../../enums');
const { knexExists } = require('../../../utils');

const updateTest = async (id, body, { knex }) => {
  const {
    title,
    description,
    availableAll,
  } = body;

  if (
    title === undefined
    && description === undefined
    && availableAll === undefined
  ) {
    return;
  }

  await knex('tests')
    .where({ id })
    .update({
      title,
      description,
      availableAll,
    });
};

const updateQuestionOptions = async (id, options, { knex }) => {
  if (options === undefined) {
    return;
  }

  const ids = options.map((option) => option.id);

  await knex('questionOptions')
    .where({ questionId: id })
    .whereNotIn('id', ids)
    .del();

  const promises = options.map((option, index) => {
    const {
      checked,
      title,
    } = option;

    return knex('questionOptions')
      .where({ id: option.id })
      .update({
        checked,
        title,
        weight: index,
      });
  });

  await Promise.all(promises);
};

const updateQuestions = async (id, questions, { knex }) => {
  if (questions === undefined) {
    return;
  }

  const ids = questions.map((question) => question.id);

  await knex('questions')
    .where('testId', id)
    .whereNotIn('id', ids)
    .del();

  const promises = questions.map((question, index) => {
    const {
      title,
      description,
      type,
      points,
      required,
      options,
    } = question;

    return Promise.all([
      knex('questions')
        .where({ id: question.id })
        .update({
          title,
          description,
          typeEnum: types[type],
          points,
          required,
          weight: index,
        }),
      updateQuestionOptions(question.id, options, { knex }),
    ]);
  });

  await Promise.all(promises);
};

module.exports = async function operation({ userId, query, body }, { log, knex, httpErrors }) {
  log.trace('updateTest');
  log.debug(userId);
  log.debug(query);
  log.debug(body);

  const { id } = query;
  const { questions } = body;

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

  await Promise.all([
    updateTest(id, body, { knex }),
    updateQuestions(id, questions, { knex }),
  ]);
};
