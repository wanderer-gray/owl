const getInfo = require('./getInfo');
const getTest = require('./getTest');
const setAnswer = require('./setAnswer');
const getResult = require('./getResult');

module.exports = (fastify) => fastify.service({
  auth: false,
  operations: [
    getInfo,
    getTest,
    setAnswer,
    getResult,
  ],
});
