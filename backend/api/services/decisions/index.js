const getDecisions = require('./getDecisions');
const setDecisions = require('./setDecisions');

module.exports = (fastify) => fastify.service({
  operations: [
    getDecisions,
    setDecisions,
  ],
});
