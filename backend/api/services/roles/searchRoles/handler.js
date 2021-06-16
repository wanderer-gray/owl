const {
  objects: { ROLES },
  actions: { SELECT },
} = require('../../../enums');
const { getCheckPermissions } = require('../../../utils');

const fmtRole = async (role, { knex }) => {
  const permissionIds = await knex('rolePermissions')
    .where('roleId', role.id)
    .pluck('permissionId');

  return {
    ...role,
    permissionIds,
  };
};

const fmtResult = async (roles, count, { knex }) => {
  const result = await Promise.all(roles.map((role) => fmtRole(role, { knex })));

  return {
    roles: result,
    count,
  };
};

module.exports = async function operation({ userId, query, body }, { log, knex, httpErrors }) {
  log.trace('searchRoles');
  log.debug(userId);
  log.debug(query);
  log.debug(body);

  const {
    name,
    limit,
  } = query;
  const { noRoleIds } = body;

  const checkPermissions = await getCheckPermissions(userId, { log, knex });

  if (!checkPermissions(ROLES, SELECT)) {
    log.warn('no permission to select a roles');

    throw httpErrors.forbidden();
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

  log.info(roles, count);

  const result = await fmtResult(roles, count, { knex });

  return result;
};
