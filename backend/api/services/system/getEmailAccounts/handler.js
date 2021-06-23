const {
  permissions: {
    objects: { SYSTEM },
    actions: { SELECT },
  },
} = require('../../../enums');
const { getCheckPermissions } = require('../../../utils');

module.exports = async function operation({ userId }, { log, knex, httpErrors }) {
  log.trace('getEmailAccounts');
  log.debug(userId);

  const checkPermissions = await getCheckPermissions(userId, { log, knex });

  if (!checkPermissions(SYSTEM, SELECT)) {
    log.warn('no permission to select a system config');

    throw httpErrors.forbidden();
  }

  const accounts = await knex('emailAccounts')
    .select('*')
    .orderBy([
      'host',
      'id',
    ]);

  log.info(accounts);

  return accounts;
};
