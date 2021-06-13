module.exports = async function operation({ userId, query }, { log, knex, httpErrors }) {
  log.trace('deleteContact');
  log.debug(userId);
  log.debug(query);

  const { id } = query;

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
