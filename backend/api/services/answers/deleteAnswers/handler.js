const { knexExists } = require('../../../utils');

module.exports = async function operation({ userId, query }, { log, knex, httpErrors }) {
  log.trace('deleteAnswers');
  log.debug(userId);
  log.debug(query);

  const { id } = query;

  const queryFindAnswers = knex('testUsers')
    .where({
      id,
      userId,
    });

  const existsAnswers = await knexExists(queryFindAnswers, knex);

  if (!existsAnswers) {
    log.warn('test answers not found');

    throw httpErrors.notFound();
  }

  await knex('testUsers')
    .where({
      id,
      userId,
    })
    .update({ userId: null });
};
