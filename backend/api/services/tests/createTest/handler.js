const {
  tests: {
    types,
    members: { CREATOR },
  },
} = require('../../../enums');

const getDbQuestions = (testId, questions) => questions.map((question, index) => {
  const {
    title,
    description,
    type,
    points,
    required,
  } = question;

  return {
    testId,
    title,
    description,
    typeEnum: types[type],
    points,
    required,
    weight: index,
  };
});

const getDbOptions = (questionIds, questions) => {
  const result = [];

  questions.forEach(({ options }, index) => {
    const questionId = questionIds[index];

    options.forEach(({ checked, title }) => {
      result.push({
        questionId,
        checked,
        title,
        weight: index,
      });
    });
  });

  return result;
};

module.exports = async function operation({ userId, body }, { log, knex }) {
  log.trace('createTest');
  log.debug(userId);
  log.debug(body);

  const {
    title,
    description,
    availableAll,
    questions,
  } = body;

  const { id: testId } = await knex('tests')
    .insert({
      title,
      description,
      availableAll,
    })
    .returning('id');

  log.info(testId);

  await knex('testMembers')
    .insert({
      testId,
      userId,
      roleEnum: CREATOR,
    });

  const dbQuestions = getDbQuestions(testId, questions);

  const questionIds = await knex('questions')
    .insert(dbQuestions)
    .returning('id');

  const dbOptions = getDbOptions(questionIds, questions);

  await knex('questionOptions')
    .insert(dbOptions);

  return testId;
};
