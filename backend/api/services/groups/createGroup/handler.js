module.exports = async function operation({ userId, body }, { log, knex }) {
  log.trace('createGroup');
  log.debug(userId);
  log.debug(body);

  const {
    title,
    contactIds,
  } = body;

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
