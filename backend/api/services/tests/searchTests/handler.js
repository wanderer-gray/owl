const {
  tests: { searchTypes },
  members: { roles: { CREATOR } },
} = require('../../../enums');
const { getDateISO } = require('../../../utils');

const searchAllTests = async ({ title, offset, limit }, { knex }) => {
  const queryTests = knex('tests')
    .where({ availableAll: true })
    .where('title', 'ilike', `${title}%`)
    .select([
      'id',
      'type',
      'title',
    ])
    .orderBy('title')
    .offset(offset)
    .limit(limit);

  const queryCountTests = knex('tests')
    .where({ availableAll: true })
    .where('title', 'ilike', `${title}%`)
    .select(knex.raw('count(*)::int'));

  const [
    tests,
    [{ count }],
  ] = await Promise.all([
    queryTests,
    queryCountTests,
  ]);

  return {
    tests,
    count,
  };
};

module.exports = async function operation(request, { log, knex, httpErrors }) {
  log.trace('searchTests');
  log.debug(request.cookies);

  const { query } = request;

  log.debug(query);

  const {
    type,
    title,
    offset,
    limit,
  } = query;

  if (type === searchTypes.ALL) {
    const result = await searchAllTests(query, { knex });

    return result;
  }

  const signUserId = request.cookies.userId;

  log.info(signUserId);

  if (!signUserId) {
    log.warn('not authorized');

    throw httpErrors.unauthorized();
  }

  const unsignUserId = request.unsignCookie(signUserId);

  log.info(unsignUserId);

  if (!unsignUserId.valid) {
    log.warn('not authorized');

    throw httpErrors.unauthorized();
  }

  const userId = Number(unsignUserId.value);

  const queryTests = knex('tests')
    .where('title', 'ilike', `${title}%`)
    .orderBy('title')
    .offset(offset)
    .limit(limit);

  const queryCountTests = knex('tests')
    .where('title', 'ilike', `${title}%`)
    .select(knex.raw('count(*)::int'));

  if (type === searchTypes.MY) {
    const existsUserMemberCreator = knex('members')
      .whereRaw('"tests"."id" = "members"."testId"')
      .where({
        userId,
        role: CREATOR,
      });

    queryTests.whereExists(existsUserMemberCreator);
    queryCountTests.whereExists(existsUserMemberCreator);
  } else if (type === searchTypes.ASSIGNED) {
    const countUseTestByUser = knex('testUsers')
      .whereRaw('"tests"."id" = "testUsers"."testId"')
      .where({ userId })
      .count('*');

    const existsUserInTestContacts = knex('contacts')
      .join('testContacts', 'contacts.id', '=', 'testContacts.contactId')
      .whereRaw('"tests"."id" = "testContacts"."testId"')
      .where((builder) => {
        builder
          .where('userIdFrom', userId)
          .orWhere('userIdTo', userId);
      })
      .where((builder) => {
        builder
          .whereNull('begin')
          .orWhere('begin', '<=', getDateISO());
      })
      .where((builder) => {
        builder
          .whereNull('end')
          .orWhere('end', '>=', getDateISO());
      })
      .where((builder) => {
        builder
          .where('limit', '=', 0)
          .orWhere('limit', '>', countUseTestByUser);
      });
    const existsUserInTestGroups = knex('contacts')
      .join('groupContacts', 'contacts.id', '=', 'groupContacts.contactId')
      .join('testGroups', 'groupContacts.groupId', '=', 'testGroups.groupId')
      .whereRaw('"tests"."id" = "testGroups"."testId"')
      .where((builder) => {
        builder
          .where('userIdFrom', userId)
          .orWhere('userIdTo', userId);
      })
      .where((builder) => {
        builder
          .whereNull('begin')
          .orWhere('begin', '<=', getDateISO());
      })
      .where((builder) => {
        builder
          .whereNull('end')
          .orWhere('end', '>=', getDateISO());
      })
      .where((builder) => {
        builder
          .where('limit', '=', 0)
          .orWhere('limit', '>', countUseTestByUser);
      });

    queryTests.andWhere((builder) => {
      builder
        .whereExists(existsUserInTestContacts)
        .orWhereExists(existsUserInTestGroups);
    });
    queryCountTests.andWhere((builder) => {
      builder
        .whereExists(existsUserInTestContacts)
        .orWhereExists(existsUserInTestGroups);
    });
  } else { // type === searchTypes.COMPLETED
    const existsUserInTestUsers = knex('testUsers')
      .whereRaw('"tests"."id" = "testUsers"."testId"')
      .where({ userId });

    queryTests.whereExists(existsUserInTestUsers);
    queryCountTests.whereExists(existsUserInTestUsers);
  }

  const [
    tests,
    [{ count }],
  ] = await Promise.all([
    queryTests,
    queryCountTests,
  ]);

  return {
    tests,
    count,
  };
};
