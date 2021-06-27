const { members: { roles: { CREATOR } } } = require('../../../enums');

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
    type,
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

module.exports = async function operation({ userId, body }, { log, knex }) {
  log.trace('createTest');
  log.debug(userId);
  log.debug(body);

  const {
    type,
    title,
    description,
    time,
    availableAll,
    questions,
  } = body;

  const [testId] = await knex('tests')
    .insert({
      type,
      title,
      description,
      time: new Date(time),
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
