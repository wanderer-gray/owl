module.exports = async function operation(_1, { log }, reply) {
  log.trace('logout');

  reply.clearCookie('userId');
};
