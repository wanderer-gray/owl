module.exports = async ({ query, body }, { log, knex }) => {
  log.info(query);
  log.info(body);
  log.info(`log: ${!!log}`);
  log.info(`knex: ${!!knex}`);

  return [
    { id: 1, name: '123' },
  ];
};
