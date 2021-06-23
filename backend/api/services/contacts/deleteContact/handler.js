const {
  permissions: {
    objects: { CONTACTS },
    actions: { DELETE },
  },
} = require('../../../enums');
const { getCheckGlobalPermissions } = require('../../../utils');

module.exports = async function operation({ userId, query }, { log, knex, httpErrors }) {
  log.trace('deleteContact');
  log.debug(userId);
  log.debug(query);

  const { id } = query;

  const checkGlobalPermissions = await getCheckGlobalPermissions({ log, knex });

  if (!checkGlobalPermissions(CONTACTS, DELETE)) {
    log.warn('not allow to delete contact');

    throw httpErrors.locked();
  }

  const numberDeletedContacts = await knex('contacts')
    .where({ id })
    .where((builder) => {
      builder
        .where({ userIdFrom: userId })
        .orWhere({ userIdTo: userId });
    })
    .del();

  log.info(numberDeletedContacts);

  if (!numberDeletedContacts) {
    log.warn('contact not found');

    throw httpErrors.notFound();
  }
};
