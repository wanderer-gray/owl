const {
  objects,
  actions,
} = require('../api/enums');
const {
  pass: {
    getSalt,
    getHash,
  },
} = require('../api/services/auth/utils');

const getPermissions = () => {
  const permissions = [];

  Object.values(objects).forEach((object) => {
    Object.values(actions).forEach((action) => {
      permissions.push({ object, action });
    });
  });

  return permissions;
};

const getRoleAdmin = () => ({
  name: 'admin',
});

const getUserAdmin = async () => {
  // eslint-disable-next-line no-console
  console.warn('НЕОБХОДИМО УДАЛИТЬ УЧЁТНУЮ ЗАПИСЬ "admin" ПОСЛЕ СОЗДАНИЯ!!!');

  const email = 'admin@owl.com';
  const password = '123456';

  const salt = getSalt();
  const hash = await getHash(password, salt);

  return {
    email,
    salt,
    hash,
  };
};

exports.up = async (knex) => {
  const permissionIds = await knex('permissions')
    .insert(getPermissions())
    .returning('id');
  const [roleId] = await knex('roles')
    .insert(getRoleAdmin())
    .returning('id');

  const rolePermissions = permissionIds.map((permissionId) => ({
    roleId,
    permissionId,
  }));

  await knex('rolePermissions').insert(rolePermissions);

  const admin = await getUserAdmin();
  const [authId] = await knex('auths')
    .insert(admin)
    .returning('id');

  await knex('authRoles')
    .insert({
      authId,
      roleId,
    });
};

exports.down = async (knex) => Promise.all([
  knex('permissions').del(),
  knex('auths').del(),
]);
