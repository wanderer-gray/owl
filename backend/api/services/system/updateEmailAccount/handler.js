const {
  permissions: {
    objects: { SYSTEM },
    actions: { UPDATE },
  },
} = require('../../../enums');
const { getCheckPermissions } = require('../../../utils');

module.exports = async function operation({ userId, query, body }, {
  log, knex, mailer, httpErrors,
}) {
  log.trace('updateEmailAccount');
  log.debug(userId);
  log.debug(query);
  log.debug(body);

  const { id } = query;
  const {
    host,
    port,
    secure,
    user,
    pass,
  } = body;

  const checkPermissions = await getCheckPermissions(userId, { log, knex });

  if (!checkPermissions(SYSTEM, UPDATE)) {
    log.warn('no permission to update a system config');

    throw httpErrors.forbidden();
  }

  const numberUpdatedAccounts = await knex('emailAccounts')
    .where({ id })
    .update({
      host,
      port,
      secure,
      user,
      pass,
    });

  if (!numberUpdatedAccounts) {
    log.warn('account not found');

    throw httpErrors.notFound();
  }

  await mailer.updateAccounts({ log, knex });
};
