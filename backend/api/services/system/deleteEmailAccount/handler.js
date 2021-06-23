const {
  permissions: {
    objects: { SYSTEM },
    actions: { DELETE },
  },
} = require('../../../enums');
const { getCheckPermissions } = require('../../../utils');

module.exports = async function operation({ userId, query }, {
  log, knex, mailer, httpErrors,
}) {
  log.trace('deleteEmailAccount');
  log.debug(userId);
  log.debug(query);

  const checkPermissions = await getCheckPermissions(userId, { log, knex });

  if (!checkPermissions(SYSTEM, DELETE)) {
    log.warn('no permission to delete a system config');

    throw httpErrors.forbidden();
  }

  const { id } = query;

  const numberDeletedAccounts = await knex('emailAccounts')
    .where({ id })
    .del();

  if (!numberDeletedAccounts) {
    log.warn('account not found');

    throw httpErrors.notFound();
  }

  await mailer.updateAccounts({ log, knex });
};
