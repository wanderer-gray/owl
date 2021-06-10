const getConfig = require('./getConfig');
const setConfig = require('./setConfig');

module.exports = async (fastify) => fastify.service({
  operations: [
    getConfig,
    setConfig,
  ],
});
