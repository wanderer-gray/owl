const {
  objects: { SYSTEM },
  actions: { CREATE },
} = require('../../../enums');
const { getCheckPermissions } = require('../../../utils');

module.exports = async function operation({ userId, body }, {
  log, knex, mailer, httpErrors,
}) {
  log.trace('createEmailAccount');
  log.debug(userId);
  log.debug(body);

  const {
    host,
    port,
    secure,
    user,
    pass,
  } = body;

  const checkPermissions = await getCheckPermissions(userId, { log, knex });

  if (!checkPermissions(SYSTEM, CREATE)) {
    log.warn('no permission to create a system config');

    throw httpErrors.forbidden();
  }

  await knex('emailAccounts')
    .insert({
      host,
      port,
      secure,
      user,
      pass,
    });

  await mailer.updateAccounts({ log, knex });
};
