const { tests: { members: { CREATOR } } } = require('../../../enums');

module.exports = async function operation({ userId, query }, { log, knex, httpErrors }) {
  log.trace('deleteTest');
  log.debug(userId);
  log.debug(query);

  const { id } = query;

  const checkUserPermissions = knex('testMembers')
    .whereRaw('"testMembers"."testId" = "tests"."id"')
    .where({
      userId,
      roleEnum: CREATOR,
    });

  const numberDeletedTests = await knex('tests')
    .where({ id })
    .whereExists(checkUserPermissions)
    .del();

  log.info(numberDeletedTests);

  if (!numberDeletedTests) {
    log.warn('test not found');

    throw httpErrors.notFound();
  }
};
