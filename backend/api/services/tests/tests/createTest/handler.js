const {
  permissions: {
    objects: { TESTS },
    actions: { CREATE },
  },
  tests,
  questions: questionsEnum,
  members: { roles: { CREATOR } },
} = require('../../../../enums');
const { getCheckPermissions } = require('../../../../utils');

const getDbQuestions = (testId, questions) => questions.map((question, index) => {
  const {
    title,
    description,
    type,
    points,
  } = question;

  return {
    testId,
    title,
    description,
    type: questionsEnum.types[type],
    points,
    weight: index,
  };
});

const getDbOptions = (questionIds, questions) => {
  const result = [];

  questions.forEach(({ options }, questionIndex) => {
    const questionId = questionIds[questionIndex];

    options.forEach(({ checked, title }, optionIndex) => {
      result.push({
        questionId,
        checked,
        title,
        weight: optionIndex,
      });
    });
  });

  return result;
};

module.exports = async function operation({ userId, body }, { log, knex, httpErrors }) {
  log.trace('createTest');
  log.debug(userId);
  log.debug(body);

  const {
    type,
    title,
    description,
    availableAll,
    questions,
  } = body;

  const checkPermissions = await getCheckPermissions(userId, { log, knex });

  if (!checkPermissions(TESTS, CREATE)) {
    log.warn('not allow to create test');

    throw httpErrors.locked();
  }

  const { id: testId } = await knex('tests')
    .insert({
      type: tests.types[type],
      title,
      description,
      availableAll,
    })
    .returning('id');

  log.info(testId);

  const dbQuestions = getDbQuestions(testId, questions);

  const questionIds = await knex('questions')
    .insert(dbQuestions)
    .returning('id');

  const dbOptions = getDbOptions(questionIds, questions);

  await knex('options')
    .insert(dbOptions);

  await knex('members')
    .insert({
      testId,
      userId,
      role: CREATOR,
    });

  return testId;
};
