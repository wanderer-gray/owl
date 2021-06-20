exports.up = (knex) => Promise.all([
  knex.schema.table('questionOptions', (table) => {
    table.dropColumn('description');
    table.boolean('checked').notNullable();
  }),
]);

exports.down = () => Promise.resolve();
