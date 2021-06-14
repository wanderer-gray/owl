const getConfig = require('./getConfig');
const setConfig = require('./setConfig');

module.exports = (fastify) => fastify.service({
  operations: [
    getConfig,
    setConfig,
  ],
});
