const {
  permissions: {
    objects: { GROUPS },
    actions: { CREATE },
  },
} = require('../../../enums');
const { getCheckPermissions } = require('../../../utils');

module.exports = async function operation({ userId, body }, { log, knex, httpErrors }) {
  log.trace('createGroup');
  log.debug(userId);
  log.debug(body);

  const {
    title,
    contactIds,
  } = body;

  const checkPermissions = await getCheckPermissions(userId, { log, knex });

  if (!checkPermissions(GROUPS, CREATE)) {
    log.warn('not allow to create group');

    throw httpErrors.locked();
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
