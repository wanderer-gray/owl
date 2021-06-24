const {
  permissions: {
    objects: { CONTACTS },
    actions: { CREATE },
  },
} = require('../../../enums');
const {
  knexExists,
  getCheckPermissions,
} = require('../../../utils');

module.exports = async function operation({ userId, body }, { log, knex, httpErrors }) {
  log.trace('createContact');
  log.debug(userId);
  log.debug(body);

  const { link } = body;

  const checkPermissions = await getCheckPermissions(userId, { log, knex });

  if (!checkPermissions(CONTACTS, CREATE)) {
    log.warn('not allow to create contact');

    throw httpErrors.locked();
  }

  const { id: userIdTo } = await knex('users')
    .where({ link })
    .whereNot({ id: userId })
    .first('id');

  log.info(userIdTo);

  if (!userIdTo) {
    log.warn('user not found by link');

    throw httpErrors.notFound();
  }

  const userIdFrom = userId;

  const queryFindContact = knex('contacts')
    .where({
      userIdFrom,
      userIdTo,
    })
    .orWhere({
      userIdFrom: userIdTo,
      userIdTo: userIdFrom,
    });

  const existsContact = await knexExists(queryFindContact, knex);

  log.info(existsContact);

  if (existsContact) {
    log.warn('contact is exists');

    throw httpErrors.conflict();
  }

  await knex('contacts')
    .insert({
      userIdFrom,
      userIdTo,
    });
};
