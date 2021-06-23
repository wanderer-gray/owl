const {
  permissions: {
    objects,
    actions,
  },
} = require('../api/enums');
const {
  pass: {
    getSalt,
    getHash,
  },
} = require('../api/services/auth/utils');

const getPermissions = () => [
  { object: objects.SYSTEM, action: actions.CREATE },
  { object: objects.SYSTEM, action: actions.UPDATE },
  { object: objects.SYSTEM, action: actions.DELETE },
  { object: objects.SYSTEM, action: actions.SELECT },
  { object: objects.PERMISSIONS, action: actions.SELECT },
  { object: objects.ROLES, action: actions.CREATE },
  { object: objects.ROLES, action: actions.UPDATE },
  { object: objects.ROLES, action: actions.DELETE },
  { object: objects.ROLES, action: actions.SELECT },
  { object: objects.USERS, action: actions.CREATE },
  { object: objects.USERS, action: actions.UPDATE },
  { object: objects.USERS, action: actions.DELETE },
  { object: objects.USERS, action: actions.SELECT },
  { object: objects.CONTACTS, action: actions.CREATE },
  { object: objects.CONTACTS, action: actions.DELETE },
  { object: objects.CONTACTS, action: actions.SELECT },
  { object: objects.GROUPS, action: actions.CREATE },
  { object: objects.GROUPS, action: actions.UPDATE },
  { object: objects.GROUPS, action: actions.DELETE },
  { object: objects.GROUPS, action: actions.SELECT },
  { object: objects.TESTS, action: actions.CREATE },
  { object: objects.TESTS, action: actions.UPDATE },
  { object: objects.TESTS, action: actions.DELETE },
];

const getGlobalPermissions = () => [
  { object: objects.CONTACTS, action: actions.CREATE, permit: true },
  { object: objects.CONTACTS, action: actions.DELETE, permit: true },
  { object: objects.CONTACTS, action: actions.SELECT, permit: true },
  { object: objects.GROUPS, action: actions.CREATE, permit: true },
  { object: objects.GROUPS, action: actions.UPDATE, permit: true },
  { object: objects.GROUPS, action: actions.DELETE, permit: true },
  { object: objects.GROUPS, action: actions.SELECT, permit: true },
  { object: objects.TESTS, action: actions.CREATE, permit: true },
  { object: objects.TESTS, action: actions.UPDATE, permit: true },
  { object: objects.TESTS, action: actions.DELETE, permit: true },
];

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
  const [
    [roleId],
    permissionIds,
  ] = await Promise.all([
    knex('roles')
      .insert(getRoleAdmin())
      .returning('id'),
    knex('permissions')
      .insert(getPermissions())
      .returning('id'),
    knex('globalPermissions')
      .insert(getGlobalPermissions()),
  ]);

  const rolePermissions = permissionIds.map((permissionId) => ({
    roleId,
    permissionId,
  }));

  const [admin] = await Promise.all([
    getUserAdmin(),
    knex('rolePermissions')
      .insert(rolePermissions),
  ]);

  const [userId] = await knex('users')
    .insert(admin)
    .returning('id');

  await knex('userRoles')
    .insert({
      userId,
      roleId,
    });
};

exports.down = async (knex) => Promise.all([
  knex('roles')
    .del(),
  knex('permissions')
    .del(),
  knex('globalPermissions')
    .del(),
  knex('users')
    .del(),
]);
