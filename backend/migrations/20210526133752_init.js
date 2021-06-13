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

  await knex.schema.createTable('codes', (table) => {
    table.string('email').notNullable();
    table.string('code').notNullable();
    table.datetime('createAt', { useTz: false, precision: 6 }).notNullable();

    table.unique('email');
  });

  await knex.schema.createTable('users', (table) => {
    table.increments('id');

    table.string('email').notNullable();
    table.string('salt').notNullable();
    table.string('hash').notNullable();

    table.uuid('link').notNullable().defaultTo(knex.raw('gen_random_uuid()'));

    table.unique('email');
  });
  await knex.schema.createTable('userRoles', (table) => {
    table.integer('userId').notNullable();
    table.integer('roleId').notNullable();

    table.foreign('userId').references('users.id').onDelete('CASCADE');
    table.foreign('roleId').references('roles.id').onDelete('CASCADE');

    table.unique(['userId', 'roleId']);
  });

  await knex.schema.createTable('contacts', (table) => {
    table.increments('id');
    table.integer('userIdFrom').notNullable();
    table.integer('userIdTo').notNullable();

    table.foreign('userIdFrom').references('users.id').onDelete('CASCADE');
    table.foreign('userIdTo').references('users.id').onDelete('CASCADE');

    table.unique(['userIdFrom', 'userIdTo']);
  });

  await knex.schema.createTable('groups', (table) => {
    table.increments('id');
    table.integer('ownerId').notNullable();

    table.string('title').notNullable();

    table.foreign('ownerId').references('users.id').onDelete('CASCADE');

    table.unique(['ownerId', 'title']);
  });
  await knex.schema.createTable('groupContacts', (table) => {
    table.integer('groupId').notNullable();
    table.integer('contactId').notNullable();

    table.foreign('groupId').references('groups.id').onDelete('CASCADE');
    table.foreign('contactId').references('contacts.id').onDelete('CASCADE');

    table.unique(['groupId', 'contactId']);
  });

  await knex.schema.createTable('tests', (table) => {
    table.increments('id');

    table.string('title').notNullable();
    table.string('description');
    table.boolean('availableAll').notNullable();
    table.datetime('createAt', { useTz: false, precision: 6 }).notNullable();
  });
  await knex.schema.createTable('testMembers', (table) => {
    table.integer('testId').notNullable();
    table.integer('userId').notNullable();
    table.integer('roleEnum').notNullable();

    table.foreign('testId').references('tests.id').onDelete('CASCADE');
    table.foreign('userId').references('users.id').onDelete('CASCADE');

    table.unique(['testId', 'userId']);
  });

  await knex.schema.createTable('questions', (table) => {
    table.increments('id');
    table.integer('testId').notNullable();

    table.string('title').notNullable();
    table.string('description');
    table.integer('weight').notNullable();
    table.integer('typeEnum').notNullable();
    table.boolean('required').notNullable();

    table.foreign('testId').references('tests.id').onDelete('CASCADE');
  });
  await knex.schema.createTable('questionOptions', (table) => {
    table.increments('id');
    table.integer('questionId').notNullable();

    table.string('title').notNullable();
    table.string('description');
    table.integer('weight').notNullable();
    table.integer('points').notNullable();
    table.jsonb('value');

    table.foreign('questionId').references('questions.id').onDelete('CASCADE');
  });

  await knex.schema.createTable('testLinks', (table) => {
    table.increments('id');
    table.integer('testId').notNullable();

    table.uuid('link').notNullable().defaultTo(knex.raw('gen_random_uuid()'));
    table.datetime('begin', { useTz: false, precision: 6 });
    table.datetime('end', { useTz: false, precision: 6 });

    table.foreign('testId').references('tests.id').onDelete('CASCADE');
  });
  await knex.schema.createTable('testLinkMembers', (table) => {
    table.integer('testLinkId').notNullable();
    table.integer('typeEnum').notNullable();
    table.integer('memberId').notNullable();

    table.foreign('testLinkId').references('testLinks.id').onDelete('CASCADE');

    table.unique(['testLinkId', 'typeEnum', 'memberId']);
  });

  await knex.schema.createTable('testUsers', (table) => {
    table.increments('id');

    table.integer('testId').notNullable();
    table.integer('userId');

    table.foreign('testId').references('tests.id').onDelete('CASCADE');
  });
  await knex.schema.createTable('testUserAnswers', (table) => {
    table.integer('testUserId').notNullable();
    table.integer('questionOptionId').notNullable();
    table.jsonb('value');

    table.foreign('testUserId').references('testUsers.id').onDelete('CASCADE');
    table.foreign('questionOptionId').references('questionOptions.id').onDelete('CASCADE');
  });
};

exports.down = async (knex) => {
  await knex.raw('drop table "emailAccounts" cascade');
  await knex.raw('drop table "emailСonditions" cascade');

  await knex.raw('drop table permissions cascade');
  await knex.raw('drop table roles cascade');
  await knex.raw('drop table "rolePermissions" cascade');

  await knex.raw('drop table codes cascade');

  await knex.raw('drop table users cascade');
  await knex.raw('drop table "userRoles" cascade');

  await knex.raw('drop table contacts cascade');

  await knex.raw('drop table groups cascade');
  await knex.raw('drop table "groupContacts" cascade');

  await knex.raw('drop table tests cascade');
  await knex.raw('drop table "testMembers" cascade');

  await knex.raw('drop table questions cascade');
  await knex.raw('drop table "questionOptions" cascade');

  await knex.raw('drop table "testLinks" cascade');
  await knex.raw('drop table "testLinkMembers" cascade');

  await knex.raw('drop table "testUsers" cascade');
  await knex.raw('drop table "testUserAnswers" cascade');
};
