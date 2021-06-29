exports.up = async (knex) => {
  await knex.schema.createTable('permissions', (table) => {
    table.comment('Разрешения');

    table.increments('id');

    table
      .integer('object')
      .notNullable()
      .comment('enums/permissions/objects');
    table
      .integer('action')
      .notNullable()
      .comment('enums/permissions/actions');

    table
      .boolean('global')
      .notNullable()
      .comment('Доступно ли всем данное действие с объектом');
    table
      .boolean('permit')
      .notNullable()
      .comment('Если доступно всем, то разрешено ли');

    table.unique(['object', 'action']);
  });

  await knex.schema.createTable('emailAccounts', (table) => {
    table.comment('SMTP аккаунты для отправки почты');

    table.increments('id');

    table.string('host').notNullable();
    table.integer('port').notNullable();
    table.boolean('secure').notNullable();
    table.string('user').notNullable();
    table.string('pass').notNullable();
  });
  await knex.schema.createTable('emailСonditions', (table) => {
    table.comment('Условия для входа / регистрации / восстановления аккаунта');

    table.increments('id');

    table
      .integer('type')
      .notNullable()
      .comment('Тип условия. enums/emailСonditions/types');
    table
      .integer('action')
      .notNullable()
      .comment('Действие для условия. enums/emailСonditions/actions');

    table
      .string('condition')
      .notNullable()
      .comment('Условие. Пример: email ILIKE condition');
  });

  await knex.schema.createTable('roles', (table) => {
    table.comment('Роли');

    table.increments('id');

    table.string('name').notNullable();

    table.unique('name');
  });
  await knex.schema.createTable('rolePermissions', (table) => {
    table.comment('Связи роли с разрешением');

    table.integer('roleId').notNullable();
    table.integer('permissionId').notNullable();

    table.foreign('roleId').references('roles.id').onDelete('CASCADE');
    table.foreign('permissionId').references('permissions.id').onDelete('CASCADE');

    table.unique(['roleId', 'permissionId']);
  });

  await knex.schema.createTable('codes', (table) => {
    table.comment('Коды для восстановления доступа / регистрации');

    table.string('email').notNullable();
    table.string('code').notNullable();

    table
      .datetime('createAt', { useTz: false, precision: 6 })
      .notNullable()
      .comment('Дата создания кода');

    table.unique('email');
  });

  await knex.schema.createTable('users', (table) => {
    table.comment('Пользователи');

    table.increments('id');

    table.string('email').notNullable();
    table.string('salt').notNullable();
    table.string('hash').notNullable();

    table
      .uuid('link')
      .notNullable()
      .defaultTo(knex.raw('gen_random_uuid()'))
      .comment('Ссылка пользователя');

    table.unique('email');
  });
  await knex.schema.createTable('userRoles', (table) => {
    table.comment('Связи пользователя с ролью');

    table.integer('userId').notNullable();
    table.integer('roleId').notNullable();

    table.foreign('userId').references('users.id').onDelete('CASCADE');
    table.foreign('roleId').references('roles.id').onDelete('CASCADE');

    table.unique(['userId', 'roleId']);
  });

  await knex.schema.createTable('contacts', (table) => {
    table.comment('Контакты');

    table.increments('id');

    table
      .integer('userIdFrom')
      .notNullable()
      .comment('Идентификатор пользователя, который создал контакт');
    table
      .integer('userIdTo')
      .notNullable()
      .comment('Идентификатор пользователя, который принял контакт');

    table.foreign('userIdFrom').references('users.id').onDelete('CASCADE');
    table.foreign('userIdTo').references('users.id').onDelete('CASCADE');

    table.unique(['userIdFrom', 'userIdTo']);
  });

  await knex.schema.createTable('groups', (table) => {
    table.comment('Группы');

    table.increments('id');

    table.string('title').notNullable();

    table
      .integer('ownerId')
      .notNullable()
      .comment('Пользователь, который владеет группой');

    table.foreign('ownerId').references('users.id').onDelete('CASCADE');

    table.unique(['title', 'ownerId']);
  });
  await knex.schema.createTable('groupContacts', (table) => {
    table.comment('Связи группы с контактом');

    table.integer('groupId').notNullable();
    table.integer('contactId').notNullable();

    table.foreign('groupId').references('groups.id').onDelete('CASCADE');
    table.foreign('contactId').references('contacts.id').onDelete('CASCADE');

    table.unique(['groupId', 'contactId']);
  });

  await knex.schema.createTable('tests', (table) => {
    table.comment('Тесты и опросы');

    table.increments('id');

    table
      .integer('type')
      .notNullable()
      .comment('Тип. enums/tests/types');
    table.string('title').notNullable();
    table.string('description');
    table
      .datetime('time', { useTz: false, precision: 6 })
      .notNullable()
      .comment('Время действия попытки у теста / опроса');

    table
      .boolean('availableAll')
      .notNullable()
      .comment('Доступен ли всем');
  });
  await knex.schema.createTable('questions', (table) => {
    table.comment('Вопросы теста');

    table.increments('id');

    table.integer('testId').notNullable();

    table.string('title').notNullable();
    table.string('description');
    table
      .integer('type')
      .notNullable()
      .comment('Тип вопроса. enums/questions/types');
    table.integer('points').notNullable();
    table
      .integer('weight')
      .notNullable()
      .comment('Индекс вопроса относительно вопросов данного теста');

    table.foreign('testId').references('tests.id').onDelete('CASCADE');
  });
  await knex.schema.createTable('options', (table) => {
    table.comment('Варианты ответа на вопрос');

    table.increments('id');

    table.integer('questionId').notNullable();

    table
      .boolean('checked')
      .notNullable()
      .comment('Верный ли вариант ответа');
    table.string('title').notNullable();
    table
      .integer('weight')
      .notNullable()
      .comment('Индекс ответа относительно ответов данного вопроса');

    table.foreign('questionId').references('questions.id').onDelete('CASCADE');
  });

  await knex.schema.createTable('decisions', (table) => {
    table.comment('Решения на основе баллов за тест');

    table.integer('testId').notNullable();

    table.string('title').notNullable();
    table.string('description');
    table.integer('from').notNullable();
    table.integer('to').notNullable();

    table.foreign('testId').references('tests.id').onDelete('CASCADE');
  });

  await knex.schema.createTable('members', (table) => {
    table.comment('Связи теста / опроса с участником (для разрешений)');

    table.integer('testId').notNullable();
    table.integer('userId').notNullable();

    table
      .integer('role')
      .notNullable()
      .comment('Роль участника. enums/members/roles');

    table.foreign('testId').references('tests.id').onDelete('CASCADE');
    table.foreign('userId').references('users.id').onDelete('CASCADE');

    table.unique(['testId', 'userId']);
  });

  await knex.schema.createTable('testContacts', (table) => {
    table.comment('Связи теста / опроса и контакта');

    table.integer('testId').notNullable();
    table.integer('contactId').notNullable();

    table
      .datetime('begin', { useTz: false, precision: 6 })
      .comment('Дата начала доступа к тесту / опросу');
    table
      .datetime('end', { useTz: false, precision: 6 })
      .comment('Дата окончания доступа к тесту / опросу');
    table
      .integer('limit')
      .notNullable()
      .defaultTo(0)
      .comment('Лимит на использование. Примечание: 0 - бесконечность');

    table.foreign('testId').references('tests.id').onDelete('CASCADE');
    table.foreign('contactId').references('contacts.id').onDelete('CASCADE');

    table.unique(['testId', 'contactId']);
  });
  await knex.schema.createTable('testGroups', (table) => {
    table.comment('Связи теста / опроса и группы');

    table.integer('testId').notNullable();
    table.integer('groupId').notNullable();

    table
      .datetime('begin', { useTz: false, precision: 6 })
      .comment('Дата начала доступа к тесту / опросу');
    table
      .datetime('end', { useTz: false, precision: 6 })
      .comment('Дата окончания доступа к тесту / опросу');
    table
      .integer('limit')
      .notNullable()
      .defaultTo(0)
      .comment('Лимит на использование для контакта из группы. Примечание: 0 - бесконечность');

    table.foreign('testId').references('tests.id').onDelete('CASCADE');
    table.foreign('groupId').references('groups.id').onDelete('CASCADE');

    table.unique(['testId', 'groupId']);
  });

  await knex.schema.createTable('testUsers', (table) => {
    table.comment('Связи теста / опроса и пользователя (может быть анонимным)');

    table.increments('id');

    table.integer('testId').notNullable();
    table
      .integer('userId')
      .comment('Примечание: null - аноним');
    table.boolean('anon').notNullable();
    table.boolean('ready').notNullable();

    table.foreign('testId').references('tests.id').onDelete('CASCADE');
    table.foreign('userId').references('users.id').onDelete('SET NULL');
  });
  await knex.schema.createTable('testUserAnswers', (table) => {
    table.comment('Связи пользователя (может быть анонимным) и ответа');

    table.integer('userId').notNullable();
    table.integer('optionId').notNullable();

    table.foreign('userId').references('testUsers.id').onDelete('CASCADE');
    table.foreign('optionId').references('options.id').onDelete('CASCADE');

    table.unique(['userId', 'optionId']);
  });
};

exports.down = async (knex) => {
  await knex.raw('drop table permissions cascade');

  await knex.raw('drop table "emailAccounts" cascade');
  await knex.raw('drop table "emailСonditions" cascade');

  await knex.raw('drop table roles cascade');
  await knex.raw('drop table "rolePermissions" cascade');

  await knex.raw('drop table codes cascade');

  await knex.raw('drop table users cascade');
  await knex.raw('drop table "userRoles" cascade');

  await knex.raw('drop table contacts cascade');

  await knex.raw('drop table groups cascade');
  await knex.raw('drop table "groupContacts" cascade');

  await knex.raw('drop table tests cascade');
  await knex.raw('drop table questions cascade');
  await knex.raw('drop table options cascade');

  await knex.raw('drop table decisions cascade');

  await knex.raw('drop table members cascade');

  await knex.raw('drop table "testContacts" cascade');
  await knex.raw('drop table "testGroups" cascade');

  await knex.raw('drop table "testUsers" cascade');
  await knex.raw('drop table "testUserAnswers" cascade');
};
