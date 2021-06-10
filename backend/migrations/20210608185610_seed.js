const {
  system,
  objects,
  actions,
} = require('../api/enums');
const {
  pass: {
    getSalt,
    getHash,
  },
} = require('../api/services/auth/utils');

const getSystemValues = () => [
  { key: system.AUTH_MAIL_TYPE_LIST, value: 'white' },
  {
    key: system.AUTH_MAIL_LIST,
    value: [
      '%@study.utmn.ru',
    ],
  },
  { key: system.SYST_MAIL_ACCOUNTS, value: [] },
];

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
  console.error('НЕОБХОДИМО УДАЛИТЬ УЧЁТНУЮ ЗАПИСЬ "admin" ПОСЛЕ СОЗДАНИЯ!!!');

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
  await knex('system').insert(getSystemValues());

  const permissionIds = await knex('permissions')
    .insert(getPermissions())
    .returning('id');
  const roleId = await knex('roles')
    .insert(getRoleAdmin())
    .returning('id');

  const rolePermissions = permissionIds.map((permissionId) => ({
    roleId,
    permissionId,
  }));

  await knex('rolePermissions').insert(rolePermissions);

  const admin = await getUserAdmin();
  const authId = await knex('auths')
    .insert(admin)
    .returning('id');

  await knex('authRoles')
    .insert({
      authId,
      roleId,
    });
};

exports.down = async (knex) => Promise.all([
  knex('system').del(),
  knex('permissions').del(),
  knex('auths').del(),
]);
