const getInfo = require('./getInfo');
const getTest = require('./getTest');
const setAnswer = require('./setAnswer');
const getResult = require('./getResult');

const deleteAnswers = require('./deleteAnswers');

module.exports = (fastify) => fastify.service({
  auth: false,
  operations: [
    getInfo,
    getTest,
    setAnswer,
    getResult,

    deleteAnswers,
  ],
});
