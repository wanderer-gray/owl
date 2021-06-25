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
  {
    object: objects.SYSTEM, action: actions.CREATE, global: false, permit: true,
  },
  {
    object: objects.SYSTEM, action: actions.UPDATE, global: false, permit: true,
  },
  {
    object: objects.SYSTEM, action: actions.DELETE, global: false, permit: true,
  },
  {
    object: objects.SYSTEM, action: actions.SELECT, global: false, permit: true,
  },
  {
    object: objects.PERMISSIONS, action: actions.SELECT, global: false, permit: true,
  },
  {
    object: objects.ROLES, action: actions.CREATE, global: false, permit: true,
  },
  {
    object: objects.ROLES, action: actions.UPDATE, global: false, permit: true,
  },
  {
    object: objects.ROLES, action: actions.DELETE, global: false, permit: true,
  },
  {
    object: objects.ROLES, action: actions.SELECT, global: false, permit: true,
  },
  {
    object: objects.USERS, action: actions.CREATE, global: false, permit: true,
  },
  {
    object: objects.USERS, action: actions.UPDATE, global: false, permit: true,
  },
  {
    object: objects.USERS, action: actions.DELETE, global: false, permit: true,
  },
  {
    object: objects.USERS, action: actions.SELECT, global: false, permit: true,
  },
  {
    object: objects.CONTACTS, action: actions.CREATE, global: true, permit: true,
  },
  {
    object: objects.CONTACTS, action: actions.DELETE, global: true, permit: true,
  },
  {
    object: objects.CONTACTS, action: actions.SELECT, global: true, permit: true,
  },
  {
    object: objects.GROUPS, action: actions.CREATE, global: true, permit: true,
  },
  {
    object: objects.GROUPS, action: actions.UPDATE, global: true, permit: true,
  },
  {
    object: objects.GROUPS, action: actions.DELETE, global: true, permit: true,
  },
  {
    object: objects.GROUPS, action: actions.SELECT, global: true, permit: true,
  },
  {
    object: objects.TESTS, action: actions.CREATE, global: true, permit: true,
  },
  {
    object: objects.TESTS, action: actions.UPDATE, global: true, permit: true,
  },
  {
    object: objects.TESTS, action: actions.DELETE, global: true, permit: true,
  },
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
  knex('roles').del(),
  knex('permissions').del(),
  knex('users').del(),
]);
