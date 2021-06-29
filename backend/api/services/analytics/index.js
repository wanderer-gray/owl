const getInfo = require('./getInfo');
const getAnswers = require('./getAnswers');
const getAnalytics = require('./getAnalytics');

module.exports = (fastify) => fastify.service({
  operations: [
    getInfo,
    getAnswers,
    getAnalytics,
  ],
});
