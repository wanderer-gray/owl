const { knexExists } = require('../../../utils');

const updateTitle = async (id, title, { knex }) => {
  if (title === undefined) {
    return;
  }

  await knex('groups')
    .where({ id })
    .update({ title });
};

const updateContacts = async (id, contactIds, { log, knex }) => {
  if (contactIds === undefined) {
    return;
  }

  await knex('groupContacts')
    .where('groupId', id)
    .del();

  const groupContacts = contactIds.map((contactId) => ({
    groupId: id,
    contactId,
  }));

  log.info(groupContacts);

  if (!groupContacts.length) {
    return;
  }

  await knex('groupContacts')
    .insert(groupContacts);
};

module.exports = async function operation({ userId, query, body }, { log, knex, httpErrors }) {
  log.trace('updateGroup');
  log.debug(userId);
  log.debug(query);
  log.debug(body);

  const { id } = query;
  const {
    title,
    contactIds,
  } = body;

  const queryFindGroup = knex('groups')
    .where({
      id,
      ownerId: userId,
    });

  const existsGroup = await knexExists(queryFindGroup, knex);

  if (!existsGroup) {
    log.warn('group not found');

    throw httpErrors.notFound();
  }

  const checkUserBadContacts = knex('contacts')
    .whereIn('id', contactIds)
    .whereNot({ userIdFrom: userId })
    .whereNot({ userIdTo: userId });

  const existsBadContact = await knexExists(checkUserBadContacts, knex);

  if (existsBadContact) {
    log.warn('no exists contact');

    throw httpErrors.forbidden();
  }

  await Promise.all([
    updateTitle(id, title, { knex }),
    updateContacts(id, contactIds, { log, knex }),
  ]);
};
