const {
  getDateISO,
  knexExists,
} = require('../../../utils');

const getTest = async (testId, { knex }) => {
  const test = await knex('tests')
    .where({ id: testId })
    .first([
      'id',
      'type',
      'title',
      'description',
      'time',
    ]);

  return test;
};

module.exports = async function operation(request, { log, knex, httpErrors }) {
  log.trace('getTest');
  log.debug(request.cookies);

  const { query } = request;

  log.debug(query);

  const { id } = query;

  const queryFindTest = knex('tests')
    .where({ id });

  const existsTest = await knexExists(queryFindTest, knex);

  if (!existsTest) {
    log.warn('test not found');

    throw httpErrors.notFound();
  }

  let userId = null;

  const signUserId = request.cookies.userId;

  log.info(signUserId);

  if (signUserId) {
    const unsignUserId = request.unsignCookie(signUserId);

    log.info(unsignUserId);

    if (unsignUserId.valid) {
      userId = Number(unsignUserId.value);
    }
  }

  const queryCheckAvailableAll = knex('tests')
    .where({
      id,
      availableAll: true,
    });

  const availableAll = await knexExists(queryCheckAvailableAll, knex);

  if (availableAll) {
    const result = await getTest(id, { knex });

    return result;
  }

  if (!userId) {
    log.warn('no permission to get a info (user not auth)');

    throw httpErrors.forbidden();
  }

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

  const queryUserInTest = knex('tests')
    .where({ id })
    .andWhere((builder) => {
      builder
        .whereExists(existsUserInTestContacts)
        .orWhereExists(existsUserInTestGroups);
    });

  const existsUserInTest = await knexExists(queryUserInTest, knex);

  if (!existsUserInTest) {
    log.warn('no permission to get a info (user not found)');

    throw httpErrors.forbidden();
  }

  const result = await getTest(id, { knex });

  return result;
};
