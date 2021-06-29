const { members: { roles: { CREATOR } } } = require('../../../enums');
const {
  knexExists,
  knexArrayAgg,
} = require('../../../utils');

module.exports = async function operation({ userId, query }, { log, knex, httpErrors }) {
  log.trace('getAnswers');
  log.debug(userId);
  log.debug(query);

  const {
    id,
    offset,
    limit,
  } = query;

  const queryFindTest = knex('tests')
    .where({ id });

  const existsTest = await knexExists(queryFindTest, knex);

  if (!existsTest) {
    log.warn('test not found');

    throw httpErrors.notFound();
  }

  const checkUserPermissions = knex('members')
    .where({
      testId: id,
      userId,
      role: CREATOR,
    });

  const userAllowUpdateTest = await knexExists(checkUserPermissions, knex);

  if (!userAllowUpdateTest) {
    log.warn('no permission to select a test');

    throw httpErrors.forbidden();
  }

  const answers = knex('testUserAnswers')
    .whereRaw('"testUsers"."id" = "testUserAnswers"."userId"')
    .select('optionId');

  const [
    users,
    [{ count }],
  ] = await Promise.all([
    knex('users')
      .join('testUsers', 'users.id', '=', 'testUsers.userId')
      .where({
        testId: id,
        anon: false,
      })
      .select([
        knex.ref('testUsers.id').as('id'),
        'email',
        knexArrayAgg(answers, knex).as('answers'),
      ])
      .orderBy('email', 'id')
      .offset(offset)
      .limit(limit),
    knex('testUsers')
      .where({
        testId: id,
        anon: false,
      })
      .select(knex.raw('count(*)::int')),
  ]);

  return {
    users,
    count,
  };
};
