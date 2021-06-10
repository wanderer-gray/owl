const {
  objects: { ROLES },
  actions: { SELECT },
} = require('../../../enums');
const { getCheckPermissions } = require('../../../utils');

const fmtRole = async (role, { knex }) => {
  const permissionIds = knex('rolePermissions')
    .where('roleId', role.id)
    .pluck('permissionId');

  return {
    ...role,
    permissionIds,
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

  const roles = await knex('roles')
    .where('name', 'ilike', `%${name}%`)
    .select('id', 'name')
    .orderBy('name')
    .limit(limit);

  log.debug(roles);

  const result = await Promise.all(roles.map((role) => fmtRole(role, { knex })));

  log.debug(result);

  return result;
};
