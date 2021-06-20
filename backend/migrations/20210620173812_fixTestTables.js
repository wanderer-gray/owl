exports.up = (knex) => Promise.all([
  knex.schema.table('tests', (table) => table.dropColumn('createAt')),
  knex.schema.table('questions', (table) => table.integer('points').notNullable()),
  knex.schema.table('questionOptions', (table) => {
    table.dropColumn('value');
    table.dropColumn('points');
  }),
  knex.schema.table('testUserAnswers', (table) => table.dropColumn('value')),
]);

exports.down = () => Promise.resolve();
