const {
  permissions: {
    objects: { TESTS },
    actions: { DELETE },
  },
  members: { roles: { CREATOR } },
} = require('../../../../enums');
const { getCheckPermissions } = require('../../../../utils');

module.exports = async function operation({ userId, query }, { log, knex, httpErrors }) {
  log.trace('deleteTest');
  log.debug(userId);
  log.debug(query);

  const { id } = query;

  const checkPermissions = await getCheckPermissions(userId, { log, knex });

  if (!checkPermissions(TESTS, DELETE)) {
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
