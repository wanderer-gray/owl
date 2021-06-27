const { knexExists } = require('../../../utils');

module.exports = async function operation({ userId, body }, { log, knex, httpErrors }) {
  log.trace('createGroup');
  log.debug(userId);
  log.debug(body);

  const {
    title,
    contactIds,
  } = body;

  const checkUserBadContacts = knex('contacts')
    .whereIn('id', contactIds)
    .whereNot({ userIdFrom: userId })
    .whereNot({ userIdTo: userId });

  const existsBadContact = await knexExists(checkUserBadContacts, knex);

  if (existsBadContact) {
    log.warn('no exists contact');

    throw httpErrors.forbidden();
  }

  const [groupId] = await knex('groups')
    .insert({
      title,
      ownerId: userId,
    })
    .returning('id');

  log.info(groupId);

  const groupContacts = contactIds.map((contactId) => ({
    groupId,
    contactId,
  }));

  log.info(groupContacts);

  if (groupContacts.length) {
    await knex('groupContacts')
      .insert(groupContacts);
  }
};
