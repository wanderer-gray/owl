const { members: { roles: { CREATOR } } } = require('../../../enums');
const { knexExists } = require('../../../utils');

module.exports = async function operation({ userId, query }, { log, knex, httpErrors }) {
  log.trace('deleteTest');
  log.debug(userId);
  log.debug(query);

  const { id } = query;

  const checkUserPermissions = knex('members')
    .where({
      testId: id,
      userId,
      role: CREATOR,
    });

  const userAllowDeleteTest = await knexExists(checkUserPermissions, knex);

  if (!userAllowDeleteTest) {
    log.warn('no permission to delete a test');

    throw httpErrors.forbidden();
  }

  await knex('tests')
    .where({ id })
    .del();
};
