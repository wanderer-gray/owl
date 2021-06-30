const searchTests = require('./searchTests');
const getTest = require('./getTest');
const createTest = require('./createTest');
const updateTest = require('./updateTest');
const deleteTest = require('./deleteTest');

const getAnswers = require('./getAnswers');

module.exports = (fastify) => fastify.service({
  operations: [
    searchTests,
    getTest,
    createTest,
    updateTest,
    deleteTest,

    getAnswers,
  ],
});
