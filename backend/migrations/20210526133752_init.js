exports.up = async (knex) => {
  await knex.schema.createTable('emailAccounts', (table) => {
    table.increments('id');

    table.string('host').notNullable();
    table.integer('port').notNullable();
    table.boolean('secure').notNullable();
    table.string('user').notNullable();
    table.string('pass').notNullable();
  });
  await knex.schema.createTable('emailСonditions', (table) => {
    table.increments('id');

    table.string('condition').notNullable();
    table.enum('type', [
      'white',
      'black',
    ]).notNullable();

    table.unique('condition');
  });

  await knex.schema.createTable('permissions', (table) => {
    table.increments('id');

    table.integer('object').notNullable();
    table.integer('action').notNullable();

    table.unique(['object', 'action']);
  });
  await knex.schema.createTable('roles', (table) => {
    table.increments('id');

    table.string('name').notNullable();

    table.unique('name');
  });
  await knex.schema.createTable('rolePermissions', (table) => {
    table.integer('roleId').notNullable();
    table.integer('permissionId').notNullable();

    table.foreign('roleId').references('roles.id').onDelete('CASCADE');
    table.foreign('permissionId').references('permissions.id').onDelete('CASCADE');

    table.unique(['roleId', 'permissionId']);
  });

  await knex.schema.createTable('auths', (table) => {
    table.increments('id');

    table.string('email').notNullable();
    table.string('salt').notNullable();
    table.string('hash').notNullable();

    table.unique('email');
  });
  await knex.schema.createTable('authRoles', (table) => {
    table.integer('authId').notNullable();
    table.integer('roleId').notNullable();

    table.foreign('authId').references('auths.id').onDelete('CASCADE');
    table.foreign('roleId').references('roles.id').onDelete('CASCADE');

    table.index('authId');
    table.unique(['authId', 'roleId']);
  });
  await knex.schema.createTable('authCodes', (table) => {
    table.string('email').notNullable();
    table.string('code').notNullable();
    table.datetime('createAt', { useTz: false, precision: 6 }).notNullable();

    table.unique('email');
  });

  await knex.schema.createTable('accounts', (table) => {
    table.integer('authId').notNullable();
    table.jsonb('profile').notNullable();

    table.foreign('authId').references('auths.id').onDelete('CASCADE');

    table.unique('authId');
  });
};

exports.down = async (knex) => {
  await knex.raw('drop table "emailAccounts" cascade');
  await knex.raw('drop table "emailСonditions" cascade');

  await knex.raw('drop table permissions cascade');
  await knex.raw('drop table roles cascade');
  await knex.raw('drop table "rolePermissions" cascade');

  await knex.raw('drop table auths cascade');
  await knex.raw('drop table "authRoles" cascade');
  await knex.raw('drop table "authCodes" cascade');

  await knex.raw('drop table accounts cascade');
};
