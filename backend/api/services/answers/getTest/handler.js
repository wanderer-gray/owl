const {
  getDateISO,
  knexExists,
  knexArrayAgg,
} = require('../../../utils');
const { getSign } = require('../utils');

const getEndDateISO = (begin, time) => {
  const root = new Date(0, 0, 0, 0, 0, 0, 0);
  const datetime = new Date(new Date(begin).getTime() + new Date(time).getTime() - root.getTime());

  return datetime.toISOString();
};

const getTest = async (testId, userId, anonymous, { knex }) => {
  const options = knex('options')
    .whereRaw('"questions"."id" = "options"."questionId"')
    .select([
      'id',
      'title',
    ])
    .orderBy('weight');

  const questions = knex('questions')
    .whereRaw('"tests"."id" = "questions"."testId"')
    .select([
      'title',
      'description',
      'type',
      knexArrayAgg(options, knex).as('options'),
    ])
    .orderBy('weight');

  const test = await knex('tests')
    .where({ id: testId })
    .first([
      'id',
      'type',
      'title',
      'description',
      'time',
      knexArrayAgg(questions, knex).as('questions'),
    ]);

  const begin = getDateISO();
  const end = getEndDateISO(begin, test.time);

  delete test.time;

  const dbTestUsers = {
    testId,
    anon: anonymous,
    ready: false,
  };

  if (userId) {
    dbTestUsers.userId = userId;
  }

  const [testUserId] = await knex('testUsers')
    .insert(dbTestUsers)
    .returning('id');

  const payload = {
    testId,
    userId: testUserId,
    begin,
    end,
  };

  const sign = await getSign(payload);

  payload.sign = sign;

  return {
    test,
    payload,
  };
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
    const result = await getTest(id, userId, true, { knex });

    return result;
  }

  if (!userId) {
    log.warn('no permission to get a test (user not auth)');

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
    log.warn('no permission to get a test (user not found)');

    throw httpErrors.forbidden();
  }

  const result = await getTest(id, userId, false, { knex });

  return result;
};
