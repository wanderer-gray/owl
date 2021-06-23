const {
  permissions: {
    objects: { TESTS },
    actions: { UPDATE },
  },
  tests,
  questions: questionsEnum,
  members: { roles: { CREATOR } },
} = require('../../../../enums');
const {
  knexExists,
  getCheckGlobalPermissions,
} = require('../../../../utils');

const updateTest = async (id, body, { knex }) => {
  const {
    type,
    title,
    description,
    availableAll,
  } = body;

  const dbTest = {};

  if (type !== undefined) {
    dbTest.type = tests.types[type];
  }

  if (title !== undefined) {
    dbTest.title = title;
  }

  if (description !== undefined) {
    dbTest.description = description;
  }

  if (availableAll !== undefined) {
    dbTest.availableAll = availableAll;
  }

  if (!Object.keys(dbTest).length) {
    return;
  }

  await knex('tests')
    .where({ id })
    .update(dbTest);
};

const createQuestion = async (testId, question, { index: questionIndex, knex }) => {
  const {
    title: questionTitle,
    description,
    type,
    points,
    options,
  } = question;

  const { id: questionId } = await knex('questions')
    .insert({
      testId,
      title: questionTitle,
      description,
      typeEnum: tests.types[type],
      points,
      weight: questionIndex,
    })
    .returning('id');

  const dbOptions = options.map((option, optionIndex) => {
    const {
      checked,
      title: optionTitle,
    } = option;

    return {
      questionId,
      checked,
      title: optionTitle,
      weight: optionIndex,
    };
  });

  await knex('options')
    .insert(dbOptions);
};

const updateOptions = async (questionId, options, { knex }) => {
  if (options === undefined) {
    return;
  }

  const ids = options
    .filter((option) => option.id)
    .map((option) => option.id);

  if (ids.length) {
    await knex('questionOptions')
      .where({ questionId })
      .whereNotIn('id', ids)
      .del();
  }

  const promises = options.map((option, index) => {
    const {
      id: optionId,
      checked,
      title,
    } = option;

    const dbOption = {};

    if (checked !== undefined) {
      dbOption.checked = checked;
    }

    if (title !== undefined) {
      dbOption.title = title;
    }

    dbOption.weight = index;

    if (!optionId) {
      return knex('options')
        .insert({
          ...dbOption,
          questionId,
        });
    }

    return knex('options')
      .where({ id: optionId })
      .update(dbOption);
  });

  await Promise.all(promises);
};

const updateQuestions = async (testId, questions, { knex }) => {
  if (questions === undefined) {
    return;
  }

  const ids = questions
    .filter(({ id }) => id)
    .map(({ id }) => id);

  if (ids.length) {
    await knex('questions')
      .where({ testId })
      .whereNotIn('id', ids)
      .del();
  }

  const promises = questions.map((question, index) => {
    const {
      id: questionId,
      title,
      description,
      type,
      points,
      options,
    } = question;

    if (!questionId) {
      return createQuestion(testId, question, { index, knex });
    }

    const dbQuestion = {};

    if (title !== undefined) {
      dbQuestion.title = title;
    }

    if (description !== undefined) {
      dbQuestion.description = description;
    }

    if (type !== undefined) {
      dbQuestion.type = questionsEnum.types[type];
    }

    if (points !== undefined) {
      dbQuestion.points = points;
    }

    dbQuestion.weight = index;

    return Promise.all([
      knex('questions')
        .where({ id: questionId })
        .update(dbQuestion),
      updateOptions(questionId, options, { knex }),
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

  const checkGlobalPermissions = await getCheckGlobalPermissions({ log, knex });

  if (!checkGlobalPermissions(TESTS, UPDATE)) {
    log.warn('not allow to update test');

    throw httpErrors.locked();
  }

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
    log.warn('no permission to update a test');

    throw httpErrors.forbidden();
  }

  await Promise.all([
    updateTest(id, body, { knex }),
    updateQuestions(id, questions, { knex }),
  ]);
};
