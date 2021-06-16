const {
  objects: { SYSTEM },
  actions: { CREATE },
} = require('../../../enums');
const { getCheckPermissions } = require('../../../utils');

module.exports = async function operation({ userId, query, body }, {
  log, knex, mailer, httpErrors,
}) {
  log.trace('updateEmailAccount');
  log.debug(userId);
  log.debug(query);
  log.debug(body);

  const checkPermissions = await getCheckPermissions(userId, { log, knex });

  if (!checkPermissions(SYSTEM, CREATE)) {
    log.warn('no permission to create a system config');

    throw httpErrors.forbidden();
  }

  const { id } = query;

  const numberUpdatedAccounts = await knex('emailAccounts')
    .where({ id })
    .update(body);

  if (!numberUpdatedAccounts) {
    log.warn('account not found');

    throw httpErrors.notFound();
  }

  await mailer.updateAccounts({ log, knex });
};
