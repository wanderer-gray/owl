const toStr = (obj) => JSON.stringify(obj, null, '');

const getDateISO = (ms = 0) => new Date(Date.now() + ms).toISOString();

const getCallbackThen = ({ log }) => (info) => {
  log.info(info);
};

const getCallbackCatch = ({ log }) => (error) => {
  log.error(error);
};

const knexExists = async (query, knex) => {
  const { result } = await knex.first(knex.raw('exists ? as result', query));

  return result;
};

const knexArrayAgg = (query, knex) => knex
  .from(query.as('vals'))
  .select(knex.raw('array_agg(row_to_json(vals))'));

const checkPermission = async (userId, { object, action }, { log, knex }) => {
  log.trace('checkPermission');

  const queryCheckUserPermission = knex('userRoles')
    .join('rolePermissions', 'userRoles.roleId', '=', 'rolePermissions.roleId')
    .whereRaw('"permissions"."id" = "rolePermissions"."permissionId"')
    .where({ userId });

  const queryCheckPermission = knex('permissions')
    .where({
      object,
      action,
    })
    .andWhere((builder) => {
      builder
        .where({
          global: true,
          permit: true,
        })
        .orWhereExists(queryCheckUserPermission);
    });

  const custom = await knexExists(queryCheckPermission, knex);

  return custom;
};

module.exports = {
  toStr,
  getDateISO,
  getCallbackThen,
  getCallbackCatch,
  knexExists,
  knexArrayAgg,
  checkPermission,
};
