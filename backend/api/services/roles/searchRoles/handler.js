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
    result,
    count,
  };
};

module.exports = async function operation({ userId, query }, { log, knex, httpErrors }) {
  log.trace('searchRoles');
  log.debug(userId);
  log.debug(query);

  const {
    name,
    limit,
  } = query;

  const checkPermissions = await getCheckPermissions(userId, { log, knex });

  if (!checkPermissions(ROLES, SELECT)) {
    log.warn('no permission to select a roles');

    throw httpErrors.forbidden();
  }

  const [
    roles,
    count,
  ] = await Promise.all([
    knex('roles')
      .where('name', 'ilike', `${name}%`)
      .select('id', 'name')
      .orderBy('name')
      .limit(limit),
    knex('roles')
      .where('name', 'ilike', `${name}%`)
      .select(knex.raw('count(*)::int')),
  ]);

  log.info(roles, count);

  const result = await fmtResult(roles, count, { knex });

  return result;
};
