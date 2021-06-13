module.exports = async function operation(_, { log }, reply) {
  log.trace('logout');

  reply.clearCookie('userId');
};
