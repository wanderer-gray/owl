const { members: { roles: { CREATOR } } } = require('../../../../enums');
const { getDateISO } = require('../../../../utils');

module.exports = async function operation({ userId, query }, { log, knex }) {
  log.trace('searchTests');
  log.debug(userId);
  log.debug(query);

  const {
    type,
    title,
    offset,
    limit,
  } = query;

  const currentDate = getDateISO();

  log.info(currentDate);

  const checkIfTestCreator = knex('testMembers')
    .whereRaw('"tests"."id" = "testMembers"."testId"')
    .where({
      userId,
      roleEnum: CREATOR,
    });

  const checkIfUserMember = knex('contacts')
    .whereRaw('"contacts"."id" = "testLinkMembers"."memberId"')
    .where('testLinkMembers.typeEnum', linkMembers.USER)
    .andWhere((builder) => {
      builder
        .where('userIdFrom', userId)
        .orWhere('userIdTo', userId);
    });

  const cehckIfUserGroup = knex('contacts')
    .whereRaw('"contacts"."id" = "groupContacts"."contactId"')
    .andWhere((builder) => {
      builder
        .where('userIdFrom', userId)
        .orWhere('userIdTo', userId);
    });

  const checkIfGroupMember = knex('groupContacts')
    .whereRaw('"groupContacts"."groupId" = "testLinkMembers"."memberId"')
    .where('testLinkMembers.typeEnum', linkMembers.GROUP)
    .whereExists(cehckIfUserGroup);

  const checkIfLinkMember = knex('testLinkMembers')
    .whereRaw('"testLinks"."id" = "testLinkMembers"."testLinkId"')
    .andWhere((builder) => {
      builder
        .whereExists(checkIfUserMember)
        .orWhereExists(checkIfGroupMember);
    });

  const checkIfTestMember = knex('testLinks')
    .whereRaw('"tests"."id" = "testLinks"."testId"')
    .andWhere((builder) => {
      builder
        .whereNull('begin')
        .orWhere(knex.raw('begin < ?', [currentDate]));
    })
    .andWhere((builder) => {
      builder
        .whereNull('end')
        .orWhere(knex.raw('end > ?', [currentDate]));
    })
    .whereExists(checkIfLinkMember);

  const checkIfTestUser = knex('testUsers')
    .whereRaw('"tests"."id" = "testUsers"."testId"')
    .where({ userId });

  const queryAll = knex('tests')
    .where('title', 'ilike', `${title}%`)
    .where('availableAll', true);

  const queryMy = knex('tests')
    .where('title', 'ilike', `${title}%`)
    .whereExists(checkIfTestCreator);

  const queryAvailable = knex('tests')
    .where('title', 'ilike', `${title}%`)
    .whereExists(checkIfTestMember);

  const queryResult = knex('tests')
    .where('title', 'ilike', `${title}%`)
    .whereExists(checkIfTestUser);

  const promises = [];

  // eslint-disable-next-line default-case
  switch (type) {
    case typesSearch.ALL:
      promises.push(queryAll.select(['id', 'title']));
      break;
    case typesSearch.MY:
      promises.push(queryMy.select(['id', 'title']));
      break;

    case typesSearch.AVAILABLE:
      promises.push(queryAvailable.select(['id', 'title']));
      break;

    case typesSearch.RESULTS:
      promises.push(queryResult.select(['id', 'title']));
      break;
  }

  const [
    roles,
    [{ count }],
  ] = await Promise.all([
    knex('roles')
      .where('name', 'ilike', `${name}%`)
      .whereNotIn('id', noRoleIds)
      .select('id', 'name')
      .orderBy('name')
      .limit(limit),
    knex('roles')
      .where('name', 'ilike', `${name}%`)
      .whereNotIn('id', noRoleIds)
      .select(knex.raw('count(*)::int')),
  ]);

  log.info(tests, counts);

  return {
    tests,
    counts,
  };
};
