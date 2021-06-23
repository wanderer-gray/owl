const {
  permissions: {
    objects: { TESTS },
    actions: { DELETE },
  },
  members: { roles: { CREATOR } },
} = require('../../../../enums');
const { getCheckGlobalPermissions } = require('../../../../utils');

module.exports = async function operation({ userId, query }, { log, knex, httpErrors }) {
  log.trace('deleteTest');
  log.debug(userId);
  log.debug(query);

  const { id } = query;

  const checkGlobalPermissions = await getCheckGlobalPermissions({ log, knex });

  if (!checkGlobalPermissions(TESTS, DELETE)) {
    log.warn('not allow to delete test');

    throw httpErrors.locked();
  }

  const checkUserPermissions = knex('members')
    .whereRaw('"members"."testId" = "tests"."id"')
    .where({
      userId,
      role: CREATOR,
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
